import SideBarAccordionElement from './SideBarAccordionElement'
import { useQuery } from 'react-query'
import { KanbanSquare, Loader2 } from 'lucide-react'
import { projectService } from '@/services/ProjectService'

interface ProjectsSidebarProps {
  isOpen: boolean
}

function ProjectsSidebar (
  { isOpen }: ProjectsSidebarProps
): JSX.Element {
  const { data, isLoading } = useQuery('projects', async () => {
    const projects = await projectService.get()
    return projects.data
  }, {
    refetchOnWindowFocus: false,
    retry: 1
  })

  if (isLoading && data === undefined) {
    return (
      <div className={'text-sm font-medium p-2 rounded-sm hover:bg-neutral-300 flex flex-row items-center justify-between w-full'}>
        <div className='inline-flex'>
          <KanbanSquare size={20} />
          <h2 className={`ml-2 ${isOpen ? 'block' : 'hidden'}`}>Proyectos</h2>
        </div>
        <Loader2 size={20} className={'animate-spin'}/>
      </div>
    )
  }

  return (
    <SideBarAccordionElement isOpen={isOpen} data={data !== undefined
      ? data.map((project) => ({
        id: project.id,
        name: project.name,
        color: project.primaryColor
      }))
      : []}/>
  )
}

export default ProjectsSidebar
