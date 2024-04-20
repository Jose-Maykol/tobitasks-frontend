/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useAuth = (Component: React.ComponentType): React.ComponentType => {
  const Authenticated = (props: any): JSX.Element => {
    const navigate = useNavigate()

    useEffect(() => {
      const checkAuth = async (): Promise<void> => {
        try {
          const token = Cookies.get('token')
          if (token === undefined) {
            navigate('/login')
          }
          // TODO: Validate token
        } catch (error) {
          console.error(error)
        }
      }
      checkAuth()
        .then(() => {
          console.log('Auth check done')
        })
        .catch((error) => {
          console.error(error)
        })
    }, [navigate])
    return <Component {...props} />
  }
  return Authenticated
}
