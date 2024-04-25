import { DndContext, type DragStartEvent, type DragEndEvent, DragOverlay, closestCorners, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import TaskColumn from './TaskColumn'
import TaskCard from './TaskCard'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'
import { type Task } from '@/types/Task'
import { type Status } from '@/types/Status'
import { socket } from '@/socket'
import { useParams } from 'react-router-dom'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import useStatusStore from '@/stores/useStatusStore'
import useCategoryStore from '@/stores/useCategoryStore'
import { type Category } from '@/types/Category'

function TaskBoardContainer (): JSX.Element {
  const params = useParams()
  const { id } = params

  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState< Task | undefined>()
  const [isConnected, setIsConnected] = useState(socket.connected)
  const draggedTaskRef = useRef<Task | undefined>(undefined)

  const { statuses, setStatuses } = useStatusStore()
  const { setCategories } = useCategoryStore()

  useEffect(() => {
    socket.io.opts.query = { projectId: id }

    socket.emit('task')

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.connect()

    socket.on('task', (data) => {
      const projectTasks: Task[] = data.tasks
      setTasks(projectTasks)
    })

    socket.on('status', (data) => {
      console.log('statuses', data.statuses)
      setStatuses(data.statuses as Status[])
    })

    socket.on('category', (data) => {
      console.log('categories', data.categories)
      setCategories(data.categories as Category[])
    })

    socket.on('updateTask', (data) => {
      const updatedTask = data.task
      console.log('updateTask', updatedTask)
      setTasks(tasks => tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    })

    socket.on('reorderTasks', (data) => {
      const newOrderTasks: string[] = data.tasks
      console.log('reorderTasks', newOrderTasks)
      if (newOrderTasks.length !== tasks.length) return
      setTasks(tasks => newOrderTasks.map(taskId => tasks.find(task => task.id === taskId) ?? tasks[0]))
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [id, setStatuses, setCategories, tasks])

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
        socket.emit('changeTaskStatus', { taskId: activeTask.id, statusId: activeTask.status })
      }
      const newOrderTasks: string[] = tasks.map(task => task.id)
      console.log('se reordenaron las tareas')
      socket.emit('reorderTask', { projectId: id, tasks: newOrderTasks })
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
      setTasks(tasks => {
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
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(task => task.id === activeId)
        const overIndex = tasks.findIndex(task => task.status === overId)
        tasks[activeIndex].status = overId as string
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    // TODO: save the new order of tasks in the database
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
