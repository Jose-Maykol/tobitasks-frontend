import { socketService } from '@/services/socketService'
import { useEffect } from 'react'

function KanbanBoard (): JSX.Element {
  useEffect(() => {
    socketService.connect('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2QxMDAwNTAyMjNhMDVmZWExNzg0MTMiLCJlbWFpbCI6Im1heWtvbHppdG9fMjAwMkBob3RtYWlsLmNvbSIsImlhdCI6MTc0MTg0MzE5MiwiZXhwIjoxNzQxOTI5NTkyfQ.oO-KWohLoG6ZfAH4vn0crnSRUd8ycvFi9nKbTFueimM')
  }, [])

  return (
    <div>
      <h1>Kanban Board</h1>
    </div>
  )
}

export default KanbanBoard
