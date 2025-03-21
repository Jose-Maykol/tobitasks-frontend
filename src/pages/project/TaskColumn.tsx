import { type Task } from '@/types/Task'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './TaskCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Ellipsis, Plus } from 'lucide-react'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import AddTaskForm from './AddTaskForm'
import AddTaskButton from './AddTaskButton'

interface TaskColumnProps {
  id: string
  stateText: string
  tasks: Task[]
}

function TaskColumn (
  { id, stateText, tasks }: TaskColumnProps
): JSX.Element {
  const { attributes, listeners, setNodeRef, isOver, transform, transition } = useSortable({
    id,
    data: {
      type: 'Stage'
    }
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  }

  return (
    <div className='w-80 h-[1000px]'>
      <div className='my-2 flex flex-row justify-between'>
        <h3 className='font-bold text-base'>{stateText}</h3>
        <div className='flex flex-row gap-2'>
          <div className='hover:text-neutral-500 text-neutral-300'>
            <Ellipsis className='cursor-pointer'/>
          </div>
          <Sheet>
            <SheetTrigger className='rounded-md bg-neutral-300 p-0.5 hover:bg-neutral-500'>
              <Plus size={20} className='cursor-pointer' color='white'/>
            </SheetTrigger>
            <AddTaskForm />
          </Sheet>
        </div>
      </div>
      <ScrollArea className='h-[1000px]'>
        <div
          style={style}
          ref={setNodeRef}
          /* {...attributes}
          {...listeners} */
          /* className={`w-80 h-full rounded-sm space-y-4 ${isOver ? 'bg-neutral-100' : null}`} */
          className='w-80 h-full rounded-sm space-y-4'
        >
          <SortableContext
            items={tasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            <AddTaskButton statusId={id} />
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  )
}

export default TaskColumn
