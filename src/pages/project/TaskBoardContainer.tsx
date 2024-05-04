import { DndContext, type DragStartEvent, type DragEndEvent, DragOverlay, closestCorners, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import TaskColumn from './TaskColumn'
import TaskCard from './TaskCard'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { useRef, useState } from 'react'
import { type Task } from '@/types/Task'
import { useParams } from 'react-router-dom'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import useStatusStore from '@/stores/useStatusStore'
import useTaskSocketStore from '@/stores/useTaskSocketStore'
import useTaskSocket from '@/hooks/useTaskSocket'
import useTasksStore from '@/stores/useTaskStore'

function TaskBoardContainer (): JSX.Element {
  const { id } = useParams()
  const [activeTask, setActiveTask] = useState< Task | undefined>()
  const draggedTaskRef = useRef<Task | undefined>(undefined)

  const { tasks, updateTasks } = useTasksStore()
  const { statuses } = useStatusStore()

  const { emitChangeTaskStatus, emitReorderTasks, isConnected } = useTaskSocketStore()

  useTaskSocket(id)

  console.log('las tareas', tasks)
  console.log('los estados', statuses)
  console.log('isConnected', isConnected)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  )

  const handleDragStart = (event: DragStartEvent): void => {
    const { active } = event
    const task = tasks.find(item => item.id === active.id)
    setActiveTask(task)
    if (task !== undefined) {
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
      if (activeTask.status !== draggedTaskRef.current.status) {
        emitChangeTaskStatus(activeTask.id, activeTask.status)
      }
      const newOrderTasks: string[] = tasks.map(task => task.id)
      console.log('se reordenaron las tareas')
      emitReorderTasks(id, newOrderTasks)
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
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverColumn = over.data.current?.type === 'Status'

    if (isActiveTask && isOverColumn) {
      updateTasks(tasks => {
        const activeIndex = tasks.findIndex(task => task.id === activeId)
        const overIndex = tasks.findIndex(task => task.status === overId)
        tasks[activeIndex].status = overId as string
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }
  }

  if (!isConnected) {
    return <div>Connecting...</div>
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
          {statuses.map(status => (
            <SortableContext items={tasks.map(item => item.id)} strategy={rectSortingStrategy} key={status.id}>
              <TaskColumn
                id={status.id}
                stateText={status.name}
                tasks={tasks.filter(task => task.status === status.id)}
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

export default TaskBoardContainer
