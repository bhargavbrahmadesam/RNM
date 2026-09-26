import axios from 'axios'
import type { ApiResponse, User } from '@squeez/shared-types'

export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
})

export async function fetchDemoUser(): Promise<User> {
  const res = await apiClient.get<ApiResponse<User>>('/users/5')
  return res.data.data
}
