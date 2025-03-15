import { ChevronDown, KanbanSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CreateProjectDialog from './CreateProjectDialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface SideBarAccordionElementProps {
  isOpen: boolean
  data: Array<{
    id: string
    name: string
    color: string
  }>
}

const getColor = (color: string): string => {
  const colors: Record<string, string> = {
    neutral: 'bg-neutral-600',
    red: 'bg-red-600'
  }

  return colors[color] ?? 'bg-neutral-300'
}

function SideBarAccordionElement (
  { isOpen, data }: SideBarAccordionElementProps
): JSX.Element {
  const [isOpenAccordion, setIsOpen] = useState(isOpen)

  const handleOpen = (): void => {
    setIsOpen(!isOpenAccordion)
  }

  useEffect(() => {
    setIsOpen(false)
  }, [isOpen])

  // TODO: Refactor this component to use the Popover component when there are many projects

  if (!isOpen) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className='text-sm font-medium p-2 rounded-sm hover:bg-neutral-200 flex flex-row items-center mx-2 justify-center'>
            <div className='inline-flex'>
              <KanbanSquare size={20} />
              <h2 className='ml-2 hidden'>Proyectos</h2>
            </div>
            <ChevronDown size={20} className='transform transition-transform duration-300 hidden'/>
          </div>
          </PopoverTrigger>
        <PopoverContent side='right' className='w-60 mb-4 p-3 ml-2 max-h-60 space-y-2'>
            <ul>
              {data.map((item: { id: string, name: string, color: string }) => (
                <li className='flex flex-row text-sm items-center font-medium rounded-sm' key={item.id}>
                  <NavLink
                    to={`/project/${item.id}`}
                    className={({ isActive }) => `w-full flex flex-row items-center font-medium p-2 rounded-sm hover:bg-neutral-200 ${isActive ? 'font-bold bg-neutral-300' : ''}`}
                    key={item.id}
                  >
                    <span className={`${getColor(item.color)} rounded-sm w-4 h-4 mr-2`}/>
                    <h3 className='truncate w-40'>{item.name}</h3>
                  </NavLink>
                </li>
              ))}
            </ul>
            <CreateProjectDialog />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <li>
        <div className={`text-sm font-medium p-2 rounded-sm hover:bg-neutral-200 flex flex-row items-center mb-2 ${isOpen ? 'justify-between' : 'mx-2 justify-center'}`} onClick={handleOpen}>
          <div className='inline-flex'>
            <KanbanSquare size={20} />
            <h2 className={`ml-2 ${isOpen ? 'block' : 'hidden'}`}>Proyectos</h2>
          </div>
          <ChevronDown size={20} className={`transform transition-transform duration-300 ${isOpen ? 'block' : 'hidden'}`} style={{ transform: isOpenAccordion ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </div>
      {isOpen && isOpenAccordion && (
        <div className='flex flex-col space-y-2'>
          <ul className='space-y-1'>
            {data.map((item: { id: string, name: string, color: string }) => (
              <li className='flex flex-row text-sm items-center font-medium rounded-sm hover:bg-neutral-300' key={item.id}>
                <NavLink
                  to={`/project/${item.id}`}
                  className={({ isActive }) => `hover:bg-neutral-200 w-full flex flex-row items-center font-medium p-2 rounded-sm ${isActive ? 'font-bold bg-neutral-300' : ''}`}
                  key={item.id}
                >
                  <span className={`${getColor(item.color)} rounded-sm w-4 h-4 mr-2`}/>
                  <h3 className='truncate w-40'>{item.name}</h3>
                </NavLink>
              </li>
            ))}
          </ul>
          <CreateProjectDialog />
        </div>
      )}
    </li>
  )
}

export default SideBarAccordionElement
