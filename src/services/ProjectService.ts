import { createApiAdapter, type ApiResponse } from '@/adapters/api-response.adapter'
import { adapterProjectResponse, adapterProjectsResponse } from '@/adapters/projects.adapter'
import api from '@/config/axios'
import { type Project } from '@/types/Project'

export const projectService = {
  async get (): Promise<ApiResponse<Project[]>> {
    const response = await api.get('projects')
    return createApiAdapter(response, adapterProjectsResponse)
  },

  async getById (id: string): Promise<ApiResponse<Project>> {
    const response = await api.get(`projects/${id}`)
    return createApiAdapter(response, adapterProjectResponse)
  }
}
