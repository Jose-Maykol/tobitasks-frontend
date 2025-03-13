/* import TaskBoardContainer from './TaskBoardContainer' */
import ProjectHeader from './ProjectHeader'
import KanbanBoard from './components/KanbanBoard'

function ProjectPage (): JSX.Element {
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
