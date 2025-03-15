export interface ProjectStage {
  id: string
  name: string
  order: number
  color: string
}

export interface Project {
  id: string
  name: string
  description: string
  primaryColor: string
  createdAt: string
  stages: ProjectStage[]
}
