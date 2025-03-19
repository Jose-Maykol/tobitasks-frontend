/* eslint-disable @typescript-eslint/no-explicit-any */
import { socketService } from '@/services/socketService'
import { useAuthStore } from '@/stores/useAuthStore'
import useProjectStore from '@/stores/useProjectStore'
import useTasksStore from '@/stores/useTaskStore'
import { type Task } from '@/types/Task'
import { closestCorners, DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useEffect, useRef, useState } from 'react'
import TaskColumn from '../TaskColumn'
import { ScrollBar } from '@/components/ui/scroll-area'
import TaskCard from '../TaskCard'

function KanbanBoard (): JSX.Element {
  const { token } = useAuthStore()
  const { project } = useProjectStore()
  const { tasks, setTasks, updateTasks } = useTasksStore()
  const [activeTask, setActiveTask] = useState< Task | undefined>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const draggedTaskRef = useRef<Task | undefined>(undefined)

  useEffect(() => {
    if (token === null) return
    socketService.connect(
      token,
      () => {
        setIsConnected(true)
      },
      () => {
        setIsConnected(false)
      }
    )

    const handleTaskList = (tasks: any): any => {
      console.warn('tasks', tasks)
      setTasks(tasks as Task[])
      setIsLoaded(true)
    }

    socketService.on('taskList', handleTaskList)
    socketService.emit('getTasks', {
      projectId: '67d3ad45d89578c7b34dfd80'
    })

    return () => {
      socketService.disconnect()
    }
  }, [token, setTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  )

  console.log('las tareas', tasks)
  console.log('el proyecto', project)

  const handleDragStart = (event: DragStartEvent): void => {
    const { active } = event
    const task = tasks.find(item => item.id === active.id)
    if (task !== undefined) {
      setActiveTask(task)
      draggedTaskRef.current = { ...task }
    }
  }

  const handleDragCancel = (): void => {
    setActiveTask(undefined)
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event
    if (over === null) return

    const activeId = active.id
    const overId = over.id

    console.log('activeTask', activeTask)
    console.log('draggedTaskRef', draggedTaskRef.current?.title)

    if (activeTask !== undefined && draggedTaskRef.current !== undefined) {
      if (activeTask.stageId !== draggedTaskRef.current.stageId) {
        /* emitChangeTaskStatus(activeTask.id, activeTask.status) */
      }
      const newOrderTasks = tasks.map(task => task.id)
      console.log('se reordenaron las tareas')
      /* emitReorderTasks(id, newOrderTasks) */
    }

    if (activeId === overId) return

    setActiveTask(undefined)
  }

  const handleDragOver = (event: DragEndEvent): Task[] | undefined => {
    const { active, over } = event
    if (over == null) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === 'Task'
    const isOverTask = over.data.current?.type === 'Task'

    if (!isActiveTask) return

    if (isActiveTask && isOverTask) {
      updateTasks(tasks => {
        const overIndex = tasks.findIndex(task => task.id === overId)
        const activeIndex = tasks.findIndex(task => task.id === activeId)
        if (tasks[activeIndex].stageId !== tasks[overIndex].stageId) {
          tasks[activeIndex].stageId = tasks[overIndex].stageId
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverColumn = over.data.current?.type === 'Stage'

    if (isActiveTask && isOverColumn) {
      updateTasks(tasks => {
        const activeIndex = tasks.findIndex(task => task.id === activeId)
        const overIndex = tasks.findIndex(task => task.stageId === overId)
        tasks[activeIndex].stageId = overId as string
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }
  }

  if (!isConnected || !isLoaded) {
    return <div>Conectando...</div>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
    >
      <ScrollArea className='w-full whitespace-nowrap h-[700px]'>
        <div className='flex flex-row justify-start gap-4'>
          {project?.stages.map(stage => (
            <SortableContext
            items={tasks.map(item => item.id)}
            strategy={rectSortingStrategy}
            key={stage.id}>
              <TaskColumn
                id={stage.id}
                stateText={stage.name}
                tasks={tasks.filter(task => task.stageId === stage.id)}
                key={stage.id}
                />
            </SortableContext>
          ))}
        </div>
        <ScrollBar orientation='horizontal'/>
      </ScrollArea>
      <DragOverlay>
        {(activeTask !== undefined) ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
