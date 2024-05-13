import { socket } from '@/socket'
import { create } from 'zustand'

interface TaskSocketStore {
  isConnected: boolean
  setIsConnected: (isConnected: boolean) => void
  emitChangeTaskStatus: (taskId: string, statusId: string) => void
  emitReorderTasks: (projectId: string | undefined, tasks: string[]) => void
  emitAddTask: (title: string, status: string) => void
}

const useTaskSocketStore = create<TaskSocketStore>((set, get) => ({
  isConnected: socket.connected,
  setIsConnected: (isConnected) => { set({ isConnected }) },
  emitChangeTaskStatus: (taskId, statusId) => {
    socket.emit('changeTaskStatus', { taskId, statusId })
  },
  emitReorderTasks: (projectId, tasks) => {
    socket.emit('reorderTask', { projectId, tasks })
  },
  emitAddTask: (title, status) => {
    socket.emit('addTask', { title, status })
  }
}))

export default useTaskSocketStore
