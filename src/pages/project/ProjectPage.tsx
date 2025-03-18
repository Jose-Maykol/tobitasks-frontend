/* import TaskBoardContainer from './TaskBoardContainer' */
import { useQuery } from 'react-query'
import ProjectHeader from './ProjectHeader'
import KanbanBoard from './components/KanbanBoard'
import { useParams } from 'react-router-dom'
import { projectService } from '@/services/ProjectService'
import useProjectStore from '@/stores/useProjectStore'

function ProjectPage (): JSX.Element {
  const { id } = useParams()
  const { setProject } = useProjectStore()
  const { data, isLoading } = useQuery('project', async () => {
    if (id === undefined) return
    const project = await projectService.getById(id)
    return project.data
  }, {
    refetchOnWindowFocus: false,
    retry: 1,
    onSuccess: (data) => {
      if (data !== undefined) {
        setProject(data)
      }
    }
  })

  if (isLoading && data === undefined) {
    return <div>Loading...</div>
  }

  return (
    <section className='flex flex-col w-full h-full'>
      <ProjectHeader />
      <div className='py-4'>
        {/* <TaskBoardContainer /> */}
        <KanbanBoard />
      </div>
    </section>
  )
}

export default ProjectPage
