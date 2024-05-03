import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

function AddTaskForm (): JSX.Element {
  return (
    <SheetContent>
    <SheetHeader>
      <SheetTitle>Agregar nueva tarea</SheetTitle>
    </SheetHeader>
    <div className='flex flex-col gap-4 my-5'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Título</Label>
        <Input id='title' name='title' type='text' placeholder='Título de la tarea' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Descripción</Label>
        <Textarea id='description' name='description' placeholder='Descripción de la tarea' />
      </div>
    </div>
    <SheetFooter>
      <Button type='submit' >Agregar tarea</Button>
    </SheetFooter>
  </SheetContent>
  )
}

export default AddTaskForm
