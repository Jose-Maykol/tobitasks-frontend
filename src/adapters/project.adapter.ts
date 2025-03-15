import { type Project } from '@/types/Project'

export interface ApiProjectResponse {
  projects: Array<{
    id: string
    name: string
    description: string
    primaryColor: string
    createdAt: string
    stages: Array<{
      _id: string
      name: string
      order: number
      color: string
    }>
  }>
}

export const adapterProjectsResponse = (data: ApiProjectResponse): Project[] => (
  data.projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    primaryColor: project.primaryColor,
    createdAt: project.createdAt,
    stages: project.stages.map(stage => ({
      id: stage._id,
      name: stage.name,
      order: stage.order,
      color: stage.color
    }))
  }))
)
