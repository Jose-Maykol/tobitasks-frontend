import { socketService } from '@/services/socketService'
import { useAuthStore } from '@/stores/useAuthStore'
import useTasksStore from '@/stores/useTaskStore'
import { type Task } from '@/types/Task'
import { useEffect, useState } from 'react'

export const useKanbanWebSocket = (projectId: string): { isConnected: boolean, isLoaded: boolean } => {
  const { token } = useAuthStore()
  const { setTasks } = useTasksStore()
  const [isConnected, setIsConnected] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (token === null) return

    const handleTaskList = (tasks: Task[]): void => {
      setTasks(tasks)
      setIsLoaded(true)
    }

    socketService.connect(
      token,
      () => { setIsConnected(true) },
      () => { setIsConnected(false) }
    )

    socketService.on('taskList', handleTaskList)
    socketService.emit('getTasks', { projectId })

    return () => {
      socketService.disconnect()
    }
  }, [token, projectId, setTasks])

  return { isConnected, isLoaded }
}
