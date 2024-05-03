import { Plus } from 'lucide-react'
import AddTaskCard from './AddTaskCard'
import { useEffect, useRef, useState } from 'react'

function AddTaskButton (): JSX.Element {
  const [showAddTaskCard, setShowAddTaskCard] = useState<boolean>(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleAddTask = (): void => {
    setShowAddTaskCard(true)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        wrapperRef.current !== null &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowAddTaskCard(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => { document.removeEventListener('mousedown', handleClickOutside) }
  }, [wrapperRef])

  return (
    <div ref={wrapperRef}>
      {showAddTaskCard && <AddTaskCard />}
      {!showAddTaskCard && (
        <button
          className="w-full bg-neutral-100 p-2 rounded-sm text-black font-semibold hover:bg-neutral-200"
          onClick={handleAddTask}
        >
          <div className="flex flex-row justify-center items-center gap-2">
            <Plus size={20} className="cursor-pointer" color="black" />
            <p>Agregar tarea</p>
          </div>
        </button>
      )}
    </div>
  )
}

export default AddTaskButton
