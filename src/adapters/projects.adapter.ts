import { type Project } from '@/types/Project'

export interface ApiProjectResponse {
  project: {
    id: string
    name: string
    description: string
    primaryColor: string
    createdAt: string
    stages: Array<{
      id: string
      name: string
      order: number
      color: string
    }>
  }
}

export interface ApiProjectsResponse {
  projects: Array<{
    id: string
    name: string
    description: string
    primaryColor: string
    createdAt: string
    stages: Array<{
      id: string
      name: string
      order: number
      color: string
    }>
  }>
}

export const adapterProjectsResponse = (data: ApiProjectsResponse): Project[] => (
  data.projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    primaryColor: project.primaryColor,
    createdAt: project.createdAt,
    stages: project.stages.map(stage => ({
      id: stage.id,
      name: stage.name,
      order: stage.order,
      color: stage.color
    }))
  }))
)

export const adapterProjectResponse = (data: ApiProjectResponse): Project => ({
  id: data.project.id,
  name: data.project.name,
  description: data.project.description,
  primaryColor: data.project.primaryColor,
  createdAt: data.project.createdAt,
  stages: data.project.stages.map(stage => ({
    id: stage.id,
    name: stage.name,
    order: stage.order,
    color: stage.color
  }))
})
