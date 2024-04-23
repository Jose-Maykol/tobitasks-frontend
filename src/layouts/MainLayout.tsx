import { useAuth } from '@/hooks/useAuth'
import SideBar from '@/pages/main/Sidebar'
import { Outlet } from 'react-router-dom'

function MainLayout (): JSX.Element {
  useAuth()

  return (
    <div className='flex flex-row w-full h-screen max-h-screen'>
      <SideBar />
      <div className='flex-1 flex-shrink-0 p-6 overflow-y-scroll mb-6'>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
