/* eslint-disable @typescript-eslint/no-explicit-any */
import { socketService } from '@/services/socketService'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect } from 'react'

function KanbanBoard (): JSX.Element {
  const { token } = useAuthStore()
  useEffect(() => {
    if (token === null) return
    socketService.connect(token)

    const handleTaskList = (tasks: any): any => {
      console.warn(tasks)
    }
    socketService.on('task_list', handleTaskList)
    socketService.emit('get_tasks', {
      projectId: '67d3ad45d89578c7b34dfd80'
    })

    return () => {
      socketService.disconnect()
    }
  }, [token])

  return (
    <div>
      <h1>Kanban Board</h1>
    </div>
  )
}

export default KanbanBoard
