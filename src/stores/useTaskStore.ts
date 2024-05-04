import { type Task } from '@/types/Task'
import { create } from 'zustand'

interface TasksStore {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  updateTasks: (updater: (prevTasks: Task[]) => Task[]) => void
  /* getTask: (id: string) => Task | undefined
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  deleteTask: (id: string) => void */
}

const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => { set({ tasks }) },
  updateTasks: (updater) => { set((state) => ({ tasks: updater(state.tasks) })) }
}))

export default useTasksStore
