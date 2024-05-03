import { useEffect, useRef } from 'react'

function AddTaskCard (): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        wrapperRef.current !== null &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        // TODO: Implement the logic to add task in backend
        console.log('Add task')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => { document.removeEventListener('mousedown', handleClickOutside) }
  }, [wrapperRef])

  return (
    <div
      className='w-80 h-36 border border-neutral-200 rounded-md p-2 bg-white'
      ref={wrapperRef}
    >
      <input
        id='title'
        name='title'
        type='text'
        placeholder='Título de la tarea'
        className='p-2 appearance-none w-full outline-none shadow-none focus:outline-none'
      />
    </div>
  )
}

export default AddTaskCard
