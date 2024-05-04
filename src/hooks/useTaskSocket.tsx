import { socket } from '@/socket'
import useCategoryStore from '@/stores/useCategoryStore'
import useStatusStore from '@/stores/useStatusStore'
import useTaskSocketStore from '@/stores/useTaskSocketStore'
import useTasksStore from '@/stores/useTaskStore'
import { type Category } from '@/types/Category'
import { type Status } from '@/types/Status'
import { type Task } from '@/types/Task'
import { useEffect } from 'react'

const useTaskSocket = (
  id: string | undefined
): void => {
  const { setTasks, updateTasks, tasks } = useTasksStore()
  const { setStatuses } = useStatusStore()
  const { setCategories } = useCategoryStore()
  const { setIsConnected } = useTaskSocketStore((state) => state)

  useEffect(() => {
    socket.io.opts.query = { projectId: id }

    socket.emit('task')

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.connect()

    socket.on('task', (data) => {
      const projectTasks: Task[] = data.tasks
      console.log('tasks', projectTasks)
      setTasks(projectTasks)
    })

    socket.on('status', (data) => {
      console.log('statuses', data.statuses)
      setStatuses(data.statuses as Status[])
    })

    socket.on('category', (data) => {
      console.log('categories', data.categories)
      setCategories(data.categories as Category[])
    })

    socket.on('updateTask', (data) => {
      const updatedTask = data.task
      console.log('updateTask', updatedTask)
      updateTasks(tasks => tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    })

    socket.on('reorderTasks', (data) => {
      const newOrderTasks: string[] = data.tasks
      console.log('reorderTasks', newOrderTasks)
      if (newOrderTasks.length !== tasks.length) return
      updateTasks(tasks => newOrderTasks.map(taskId => tasks.find(task => task.id === taskId) ?? tasks[0]))
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [id, setStatuses, setCategories, tasks, setTasks, updateTasks, setIsConnected])
}

export default useTaskSocket
