import { type Project } from '@/types/Project'
import { create } from 'zustand'

interface ProjectStore {
  projects: Project[]
  project: Project | undefined
  setProjects: (projects: Project[]) => void
  getProjectName: (id: string) => string | undefined
  setProject: (project: Project) => void
  getStageName: (stageId: string) => string | undefined
  /* getProjectById: (id: string) => Project | undefined */
}

const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  project: undefined,
  setProjects: (projects) => { set({ projects }) },
  getProjectName: (id: string) => {
    const project = get().projects.find(project => project.id === id)
    return project !== undefined ? project.name : undefined
  },
  setProject: (project) => { set({ project }) },
  getStageName: (stageId) => {
    const stage = get().project?.stages.find(stage => stage.id === stageId)
    return stage !== undefined ? stage.name : undefined
  }
}))

export default useProjectStore
