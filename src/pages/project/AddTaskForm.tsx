import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { socketService } from '@/services/socketService'
import useProjectStore from '@/stores/useProjectStore'
import { SocketEvent } from '@/types/Socket'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const taskSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3)
})

type TaskForm = z.infer<typeof taskSchema>

function AddTaskForm (): JSX.Element {
  const { project } = useProjectStore()

  const { register, handleSubmit, formState: { errors } } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const onSubmit = (data: TaskForm): void => {
    if (project === undefined) return

    try {
      socketService.emit(SocketEvent.ADD_TASK, {
        projectId: project.id,
        title: data.title,
        description: data.description,
        stageId: project.stages[0].id // TODO: Cambiar por el stage de la columna de donde se llama el formulario
      })
      toast.success('Tarea agregada')
    } catch (error) {
      toast.error('Error al agregar la tarea')
    }
  }

  return (
    <SheetContent>
    <SheetHeader>
      <SheetTitle>Agregar nueva tarea</SheetTitle>
    </SheetHeader>
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 my-5">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título de la tarea"
              {...register('title')}
            />
            {errors.title !== null && <p className="text-red-500">{errors.title?.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la tarea"
              {...register('description')}
            />
            {errors.description !== null && <p className="text-red-500">{errors.description?.message}</p>}
          </div>
          {/* Puedes agregar más campos aquí si es necesario */}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Agregar tarea</Button>
          </SheetClose>
        </SheetFooter>
      </form>
  </SheetContent>
  )
}

export default AddTaskForm
