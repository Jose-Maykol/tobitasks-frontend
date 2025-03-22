import { socketService } from '@/services/socketService'
import { useAuthStore } from '@/stores/useAuthStore'
import useTasksStore from '@/stores/useTaskStore'
import { type Task } from '@/types/Task'
import { useEffect, useState } from 'react'

export const useKanbanWebSocket = (projectId: string): { isConnected: boolean, isLoaded: boolean } => {
  const { token } = useAuthStore()
  const { setTasks, updateTask } = useTasksStore()
  const [isConnected, setIsConnected] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (token === null) return

    const handleTaskList = (tasks: Task[]): void => {
      setTasks(tasks)
      setIsLoaded(true)
    }

    const handleUpdateTask = (task: Task): void => {
      console.warn('task updated', task)
      updateTask(task)
    }

    socketService.connect(
      token,
      () => { setIsConnected(true) },
      () => { setIsConnected(false) }
    )

    socketService.on('taskList', handleTaskList)
    socketService.emit('getTasks', { projectId })

    socketService.on('taskUpdated', handleUpdateTask)

    return () => {
      socketService.disconnect()
    }
  }, [token, projectId, setTasks, updateTask])

  return { isConnected, isLoaded }
}
