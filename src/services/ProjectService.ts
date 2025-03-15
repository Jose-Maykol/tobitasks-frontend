import { createApiAdapter, type ApiResponse } from '@/adapters/api-response.adapter'
import { adapterProjectsResponse } from '@/adapters/project.adapter'
import api from '@/config/axios'
import { type Project } from '@/types/Project'

export const projectService = {
  async get (): Promise<ApiResponse<Project[]>> {
    const response = await api.get('projects')
    return createApiAdapter(response, adapterProjectsResponse)
  }
}
