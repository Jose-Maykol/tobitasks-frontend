import TaskBoardContainer from './TaskBoardContainer'
import ProjectHeader from './ProjectHeader'

function ProjectPage (): JSX.Element {
  return (
    <section className='flex flex-col w-full h-full'>
      <ProjectHeader />
      <div className='py-4'>
        {/* <TaskBoardContainer /> */}
      </div>
    </section>
  )
}

export default ProjectPage
