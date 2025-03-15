import { Button } from '@/components/ui/button'
import LoginForm from './components/LoginForm'

function LoginPage (): JSX.Element {
  const backgroundStyle = {
    background: `
      conic-gradient(from 0deg at calc(500%/6) calc(100%/3), #d0b8ff 0 120deg, #0000 0),
      conic-gradient(from -120deg at calc(100%/6) calc(100%/3), #7000ff 0 120deg, #0000 0),
      conic-gradient(from 120deg at calc(100%/3) calc(500%/6), #4f00eb 0 120deg, #0000 0),
      conic-gradient(from 120deg at calc(200%/3) calc(500%/6), #4f00eb 0 120deg, #0000 0),
      conic-gradient(from -180deg at calc(100%/3) 50%, #7000ff 60deg, #4f00eb 0 120deg, #0000 0),
      conic-gradient(from 60deg at calc(200%/3) 50%, #4f00eb 60deg, #d0b8ff 0 120deg, #0000 0),
      conic-gradient(from -60deg at 50% calc(100%/3), #4f00eb 120deg, #7000ff 0 240deg, #d0b8ff 0)
    `,
    backgroundSize: '346px 200px'
  }

  return (
    <div className='h-screen flex items-center justify-between'>
      <div style={backgroundStyle} className='w-full h-full'>
      </div>
      <div className='w-[600px] h-full px-20 bg-white flex flex-col justify-center'>
        <div className='py-10'>
          <h1 className='text-4xl font-bold'>TobiTasks</h1>
          <span>Bienvenido de nuevo</span>
        </div>
        <div>
          <LoginForm />
          <div className='flex py-2 text-sm'>
            <p>¿No tienes cuenta? <a href='#' className='text-blue-500'>Crear cuenta</a></p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">o</span>
            </div>
          </div>
          <div className='flex flex-col justify-center gap-4 py-4'>
            <Button variant='secondary'>
              <svg xmlns='http://www.w3.org/2000/svg' width='1.3em' height='1.3em' className='mr-2' viewBox='0 0 128 128'><path fill='#fff' d='M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38'></path><path fill='#e33629' d='M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21'></path><path fill='#f8bd00' d='M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9'></path><path fill='#587dbd' d='M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68'></path><path fill='#319f43' d='M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4'></path></svg>
              Ingresar con Google
            </Button>
            <Button variant='secondary'>
              <svg xmlns='http://www.w3.org/2000/svg' width='1.5em' height='1.5em' className='mr-2' viewBox='0 0 24 24'><path fill='currentColor' d='M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2'/></svg>
              Ingresar con Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
