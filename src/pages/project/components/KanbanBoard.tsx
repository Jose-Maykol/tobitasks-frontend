/* eslint-disable @typescript-eslint/no-explicit-any */
import { socketService } from '@/services/socketService'
import { useAuthStore } from '@/stores/useAuthStore'
import useProjectStore from '@/stores/useProjectStore'
import useTasksStore from '@/stores/useTaskStore'
import { type Task } from '@/types/Task'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useEffect, useState } from 'react'
import TaskColumn from '../TaskColumn'
import { ScrollBar } from '@/components/ui/scroll-area'
import TaskCard from '../TaskCard'

function KanbanBoard (): JSX.Element {
  const { token } = useAuthStore()
  const { project } = useProjectStore()
  const { tasks, setTasks } = useTasksStore()
  const [activeTask, setActiveTask] = useState< Task | undefined>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

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

  if (!isConnected || !isLoaded) {
    return <div>Conectando...</div>
  }

  return (
    <DndContext
      sensors={sensors}
      /* collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel} */
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
