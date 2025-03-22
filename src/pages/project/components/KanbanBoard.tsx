/* eslint-disable @typescript-eslint/no-explicit-any */
import useProjectStore from '@/stores/useProjectStore'
import useTasksStore from '@/stores/useTaskStore'
import { type Task } from '@/types/Task'
import { closestCenter, DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useRef, useState } from 'react'
import TaskColumn from '../TaskColumn'
import { ScrollBar } from '@/components/ui/scroll-area'
import TaskCard from '../TaskCard'
import { useKanbanWebSocket } from '../hooks/useKanbanSocket'
import { socketService } from '@/services/socketService'
import { SocketEvent } from '@/types/Socket'

function KanbanBoard (): JSX.Element {
  const { project } = useProjectStore()
  const { tasks, setTasks, updateTasks, updateTask } = useTasksStore()
  const [activeTask, setActiveTask] = useState< Task | undefined>()
  const draggedTaskRef = useRef<Task | undefined>(undefined)

  const { isConnected, isLoaded } = useKanbanWebSocket(project?.id ?? '')

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
    if (task !== undefined) {
      setActiveTask(task)
      draggedTaskRef.current = { ...task }
    }
  }

  const handleDragCancel = (): void => {
    setActiveTask(undefined)
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    setActiveTask(undefined)

    const { active, over } = event
    if (over === null) return

    const activeId = active.id
    /* const overId = over.id */

    if (over === null) return

    const task = tasks.find(item => item.id === activeId)

    if (task === undefined) return

    socketService.emit(SocketEvent.UPDATE_TASK, {
      id: task.id,
      stageId: task.stageId,
      sortOrder: task.sortOrder
    })

    /* const isActiveTask = active.data.current?.type === 'Task'
    const isOverTask = over.data.current?.type === 'Task'
    const isOverColumn = over.data.current?.type === 'Stage'

    if (isActiveTask && isOverTask) {
      const stageId = over.data.current?.stageId
      console.warn(stageId)
      const tasksOfStage = tasks.filter((task) => task.stageId === stageId)
      console.warn(tasksOfStage)
      const overIndex = tasks.findIndex(task => task.id === overId)
      const activeTask = tasks[overIndex]
      const previousTask = tasks[overIndex - 1] ?? null
      const nextTask = tasks[overIndex + 1] ?? null

      if (previousTask !== null && nextTask !== null) {
        const newSortOrder = (previousTask.sortOrder + nextTask.sortOrder) / 2
        activeTask.sortOrder = newSortOrder
        console.warn(newSortOrder)
      } else if (previousTask === null && nextTask === null) {
        const newSortOrder = 1
        activeTask.sortOrder = newSortOrder
        console.warn(newSortOrder)
      } else if (previousTask === null) {
        console.log(nextTask.sortOrder)
        const newSortOrder = (nextTask.sortOrder / 2)
        activeTask.sortOrder = newSortOrder
        console.warn(newSortOrder)
      } else if (nextTask === null) {
        console.log(previousTask.sortOrder)
        const newSortOrder = (previousTask.sortOrder + 1)
        activeTask.sortOrder = newSortOrder
        console.warn(newSortOrder)
      }
    } */

    /* const activeId = active.id
    const overId = over.id

    console.log('activeTask', activeTask)
    console.log('draggedTaskRef', draggedTaskRef.current?.title)

    if (activeTask !== undefined && draggedTaskRef.current !== undefined) {
      if (activeTask.stageId !== draggedTaskRef.current.stageId) {
                emitChangeTaskStatus(activeTask.id, activeTask.status)
      }
      const newOrderTasks = tasks.map(task => task.id)
      console.log('se reordenaron las tareas')
      emitReorderTasks(id, newOrderTasks)
    }

    if (activeId === overId) return */

    setActiveTask(undefined)
  }

  const handleDragOver = (event: DragEndEvent): Task[] | undefined => {
    const { active, over } = event

    if (active === null || over === null) return

    const activeId = active.id
    const overId = over.id

    /* console.warn(`active: ${JSON.stringify(active)}`)
    console.warn(`over: ${JSON.stringify(over)}`) */

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === 'Task'
    const isOverTask = over.data.current?.type === 'Task'
    const isOverColumn = over.data.current?.type === 'Stage'

    if (!isActiveTask) return

    // 1. Mover tarea ENTRE TAREAS (misma columna)
    if (isActiveTask && isOverTask) {
      const stageId = over.data.current?.stageId
      // Obtener tareas de la columna destino (usando el stageId correcto)
      const tasksOfStage = tasks.filter((task) => task.stageId === stageId).sort((a, b) => a.sortOrder - b.sortOrder)

      console.error('tasksOfStage', tasksOfStage)

      // Encontrar índices dentro de tasksOfStage, no en el array global
      const overIndexInStage = tasksOfStage.findIndex((task) => task.id === overId)
      const activeTask = tasks.find((task) => task.id === activeId) ?? undefined

      if (activeTask === undefined) return

      // Casos posibles: insertar arriba, abajo, o en una columna vacía
      let newSortOrder: number

      if (tasksOfStage.length === 0) {
        // Columna vacía: asignar orden 1
        newSortOrder = 1
        updateTask({ ...activeTask, sortOrder: newSortOrder, stageId })
      } else if (overIndexInStage === 0) {
        // Insertar al inicio
        console.warn('Insertar al inicio')
        console.log(tasksOfStage[0].sortOrder)
        newSortOrder = tasksOfStage[0].sortOrder / 2
        updateTask({ ...activeTask, sortOrder: newSortOrder, stageId })
      } else if (overIndexInStage === tasksOfStage.length - 1) {
        // Insertar al final
        console.warn('Insertar al final')
        newSortOrder = tasksOfStage[tasksOfStage.length - 1].sortOrder + 1
        updateTask({ ...activeTask, sortOrder: newSortOrder, stageId })
      } else {
        // Insertar entre dos tareas
        console.warn('Insertar entre dos tareas')
        const prevTask = tasksOfStage[overIndexInStage - 1]
        const nextTask = tasksOfStage[overIndexInStage]
        newSortOrder = (prevTask.sortOrder + nextTask.sortOrder) / 2
        updateTask({ ...activeTask, sortOrder: newSortOrder, stageId })
      }

      // Actualizar el estado INMUTABLEMENTE
      /* updateTasks(tasks => {
        return tasks.map((task) => {
          if (task.id === activeId) {
            return { ...task, sortOrder: newSortOrder, stageId }
          }
          return task
        })
      }) */
      /* updateTaskInBackend(activeId, { sortOrder: newSortOrder, stageId }) // Persistir en backend */
    }

    /* if (isActiveTask && isOverColumn) {
      updateTasks(tasks => {
        const activeIndex = tasks.findIndex(task => task.id === activeId)
        const activeTask = tasks[activeIndex]

        if (activeTask !== undefined) {
          activeTask.stageId = overId as string
          return arrayMove(tasks, activeIndex, activeIndex)
        }

        return tasks
      })
    } */

    // 2. Mover tarea a una COLUMNA VACÍA o como primera tarea
    // TODO: SIGUE TENIENDO ERRORES
    if (isActiveTask && isOverColumn) {
      const stageId = over.id as string
      console.error('stageId', over)
      const tasksOfStage = tasks.filter((task) => task.stageId === stageId).sort((a, b) => a.sortOrder - b.sortOrder)
      const activeTask = tasks.find((task) => task.id === activeId) ?? undefined
      const overIndexInStage = tasksOfStage.findIndex((task) => task.id === overId)

      if (activeTask === undefined) return

      let newSortOrder: number

      console.log('tasksOfStage', tasksOfStage.length)

      if (tasksOfStage.length === 0) {
        // Columna vacía: asignar orden 1
        newSortOrder = 1
        updateTask({ ...activeTask, sortOrder: newSortOrder, stageId })
      } else {
        // Obtener la posición relativa del drag (ej: coordenadas Y)
        const overRect = over.rect // Área del droppable (columna)
        const activeRect = active.rect.current // Área del elemento arrastrado

        // Calcular posición relativa (si el cursor está en la mitad superior o inferior de la columna)
        const isDraggingToTopHalf =
          (activeRect.translated?.top ?? 0) + (activeRect.translated?.height ?? 0) / 2 < overRect.top + overRect.height / 2

        if (isDraggingToTopHalf) {
          // Insertar al INICIO de la columna
          updateTask({ ...activeTask, sortOrder: tasksOfStage[0].sortOrder / 2, stageId })
        } else {
          // Insertar al FINAL de la columna
          /* const lastTask = tasksOfStage[tasksOfStage.length - 1] */
          updateTask({ ...activeTask, sortOrder: tasksOfStage[tasksOfStage.length - 1].sortOrder + 1, stageId })
        }
      }/* else if (overIndexInStage === 0) {
        // Insertar al inicio
        console.warn('Insertar al inicio')
        console.error(tasksOfStage)
        newSortOrder = tasksOfStage[0].sortOrder / 2
        updateTask({ ...activeTask, sortOrder: newSortOrder, stageId })
      } else if (overIndexInStage === tasksOfStage.length - 1) {
        // Insertar al final
        console.warn('Insertar al final')
        console.error(tasksOfStage)
        newSortOrder = tasksOfStage[tasksOfStage.length - 1].sortOrder + 1
        updateTask({ ...activeTask, sortOrder: newSortOrder, stageId })
      } *//*  else if (tasksOfStage.length > 1) {
        // Insertar entre dos tareas
        console.warn('Insertar entre dos tareas')
        console.error(tasksOfStage)
        const prevTask = tasksOfStage[overIndexInStage - 1]
        const nextTask = tasksOfStage[overIndexInStage]
        newSortOrder = (prevTask.sortOrder + nextTask.sortOrder) / 2
        updateTask({ ...activeTask, sortOrder: newSortOrder, stageId })
      } */
    }

    /* const { active, over } = event

    if (over == null) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === 'Task'
    const isOverTask = over.data.current?.type === 'Task'
    const isOverColumn = over.data.current?.type === 'Stage'

    if (!isActiveTask) return

    if (isActiveTask && isOverTask) {
      const stageId = over.data.current?.stageId
      console.warn(stageId)
      const tasksOfStage = tasks.filter((task) => task.stageId === stageId)

      updateTasks(tasks => {
        const activeIndex = tasks.findIndex(task => task.id === activeId)
        const overIndex = tasks.findIndex(task => task.id === overId)

        const activeTask = tasks[activeIndex]
        const overTask = tasks[overIndex]

        console.warn('activeTask', activeIndex)
        console.warn('overTask', overIndex)

        if (activeTask.stageId !== overTask.stageId) {
          activeTask.stageId = overTask.stageId
          return arrayMove(tasks, activeIndex, overIndex)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    if (isActiveTask && isOverColumn) {
      updateTasks(tasks => {
        const activeIndex = tasks.findIndex(task => task.id === activeId)
        const activeTask = tasks[activeIndex]

        if (activeTask !== undefined) {
          activeTask.stageId = overId as string
          return arrayMove(tasks, activeIndex, activeIndex)
        }

        return tasks
      })
    } */
  }

  if (!isConnected || !isLoaded) {
    return <div>Conectando...</div>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
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
            strategy={verticalListSortingStrategy}
            key={stage.id}>
              <TaskColumn
                id={stage.id}
                stateText={stage.name}
                tasks={tasks.filter(task => task.stageId === stage.id).sort((a, b) => a.sortOrder - b.sortOrder)}
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
