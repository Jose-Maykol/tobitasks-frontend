import { socketService } from '@/services/socketService'
import { useAuthStore } from '@/stores/useAuthStore'
import useTasksStore from '@/stores/useTaskStore'
import { SocketEvent } from '@/types/Socket'
import { type Task } from '@/types/Task'
import { useEffect, useState, useCallback } from 'react'

export const useKanbanWebSocket = (projectId: string): { isConnected: boolean, isLoaded: boolean } => {
  const { token } = useAuthStore()
  const [isLoaded, setIsLoaded] = useState(false)
  const { setTasks, updateTask, updateTasks } = useTasksStore()
  const [isConnected, setIsConnected] = useState(false)

  const handleTaskList = useCallback((tasks: Task[]): void => {
    setTasks(tasks)
    setIsLoaded(true)
  }, [setTasks])

  const handleUpdateTask = useCallback((task: Task): void => {
    console.warn('task updated', task)
    updateTask(task)
  }, [updateTask])

  const handleAddTask = useCallback((task: Task): void => {
    console.warn('task added', task)
    updateTasks((tasks) => [...tasks, task])
  }, [updateTasks])

  useEffect(() => {
    if (token === null) return

    socketService.connect(
      token,
      () => { setIsConnected(true) },
      () => { setIsConnected(false) }
    )

    socketService.emit(SocketEvent.GET_TASKS, { projectId })
    socketService.on(SocketEvent.TASK_CREATED, handleAddTask)
    socketService.on(SocketEvent.TASK_LIST, handleTaskList)
    socketService.on(SocketEvent.TASK_UPDATED, handleUpdateTask)

    return () => {
      socketService.disconnect()
      socketService.off(SocketEvent.TASK_LIST, handleTaskList)
      socketService.off(SocketEvent.TASK_UPDATED, handleUpdateTask)
    }
  }, [token, projectId, handleTaskList, handleUpdateTask])

  return { isConnected, isLoaded }
}
