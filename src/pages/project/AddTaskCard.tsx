import useTaskSocketStore from '@/stores/useTaskSocketStore'
import { CheckCircle2 } from 'lucide-react'

interface AddTaskCardProps {
  statusId: string
  onClose: () => void
}

function AddTaskCard (
  { statusId, onClose }: AddTaskCardProps
): JSX.Element {
  const { emitAddTask } = useTaskSocketStore()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      const title = (event.target as HTMLInputElement).value
      console.log(title)
      if (title.trim() === '') return
      emitAddTask(title, statusId)
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
  }

  return (
    <div className='w-80 h-36 border border-neutral-200 rounded-md p-2 bg-white' >
      <div className='flex flex-col justify-between'>
        <div className='flex flex-row justify-start items-center mb-2 text-base'>
          <CheckCircle2 size={22} className='mr-2'/>
          <input
            id='title'
            name='title'
            type='text'
            placeholder='Título de la tarea'
            className='p-2 appearance-none w-full outline-none shadow-none focus:outline-none'
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  )
}

export default AddTaskCard
