import useProjectStore from '@/stores/useProjectStore'
import { type Task } from '@/types/Task'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle2 } from 'lucide-react'

interface TaskCardProps {
  task: Task
}

function TaskCard (
  { task }: TaskCardProps
): JSX.Element {
  const { getStageName } = useProjectStore()
  /* const { getCategoryName } = useCategoryStore() */
  const { attributes, listeners, setNodeRef, isDragging, transition, transform } = useSortable({
    id: task.id,
    data: {
      type: 'Task'
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className='w-80 h-36 rounded-sm bg-neutral-200'/>
    )
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className='w-80 h-36 border border-neutral-200 rounded-md p-2 bg-white'
    >
      <div className='flex flex-col justify-between'>
        <div className='flex flex-row justify-start items-center mb-2 text-base'>
          <CheckCircle2 size={22} className='mr-2'/>
          <h3 className='font-bold text-base first-letter:uppercase'>{task.title}</h3>
        </div>
        <div className='flex flex-row justify-start gap-2 flex-wrap'>
          <div className='text-xs bg-amber-400 rounded-sm px-2 font-semibold py-1'>
            <p>{getStageName(task.stageId)}</p>
          </div>
          {/* <div className='text-xs bg-green-500 rounded-sm px-2 font-semibold py-1'>
            <p>{getCategoryName(task.category)}</p>
          </div> */}
        </div>
        <div className='text-sm line-clamp-2 whitespace-normal my-2'>
          <p className='first-letter:uppercase'>{ task.description !== null && task.description } </p>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
