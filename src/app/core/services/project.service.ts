import { Injectable } from '@angular/core';
import { BaseApiService, PaginatedResponse, ApiResponse } from './base-api.service';
import { Observable } from 'rxjs';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  budget: number;
  spent: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  clientId: string;
  client?: { name: string };
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService {
  private readonly endpoint = 'projects';

  getProjects(params?: any): Observable<PaginatedResponse<Project>> {
    return this.get<Project[]>(this.endpoint, params) as Observable<PaginatedResponse<Project>>;
  }

  getProjectById(id: string): Observable<ApiResponse<Project>> {
    return this.get<Project>(`${this.endpoint}/${id}`);
  }

  createProject(data: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.post<Project>(this.endpoint, data);
  }

  updateProject(id: string, data: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.patch<Project>(`${this.endpoint}/${id}`, data);
  }

  deleteProject(id: string): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}
