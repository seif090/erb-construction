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
  progress?: number;
  clientId: string;
  client?: { name: string };
  stages?: ProjectStage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  order: number;
  progress: number;
  isCompleted: boolean;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export interface CreateProjectStageDto {
  name: string;
  nameAr?: string;
  description?: string;
  order: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
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

  addProjectStage(projectId: string, data: CreateProjectStageDto): Observable<ApiResponse<ProjectStage>> {
    return this.post<ProjectStage>(`${this.endpoint}/${projectId}/stages`, data);
  }

  updateProjectStage(projectId: string, stageId: string, data: Partial<ProjectStage>): Observable<ApiResponse<ProjectStage>> {
    return this.put<ProjectStage>(`${this.endpoint}/${projectId}/stages/${stageId}`, data);
  }

  createProject(data: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.post<Project>(this.endpoint, data);
  }

  updateProject(id: string, data: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.put<Project>(`${this.endpoint}/${id}`, data);
  }

  deleteProject(id: string): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}
