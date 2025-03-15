import { socketService } from '@/services/socketService'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect } from 'react'

function KanbanBoard (): JSX.Element {
  const { token } = useAuthStore()
  useEffect(() => {
    if (token === null) return
    socketService.connect(token)
  }, [token])

  return (
    <div>
      <h1>Kanban Board</h1>
    </div>
  )
}

export default KanbanBoard
