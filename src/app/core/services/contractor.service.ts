import { Injectable } from '@angular/core';
import { BaseApiService, PaginatedResponse, ApiResponse } from './base-api.service';
import { Observable } from 'rxjs';

export interface Contractor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  specialty: string;
  specialties: string[];
  rating: number;
  totalProjects: number;
  dailyRate?: number;
  notes?: string;
  isActive: boolean;
  nationalId?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContractorService extends BaseApiService {
  private readonly endpoint = 'contractors';

  getContractors(params?: any): Observable<PaginatedResponse<Contractor>> {
    return this.get<Contractor[]>(this.endpoint, params) as Observable<PaginatedResponse<Contractor>>;
  }

  getContractorById(id: string): Observable<ApiResponse<Contractor>> {
    return this.get<Contractor>(`${this.endpoint}/${id}`);
  }

  createContractor(data: Partial<Contractor>): Observable<ApiResponse<Contractor>> {
    return this.post<Contractor>(this.endpoint, data);
  }

  updateContractor(id: string, data: Partial<Contractor>): Observable<ApiResponse<Contractor>> {
    return this.patch<Contractor>(`${this.endpoint}/${id}`, data);
  }

  deleteContractor(id: string): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}
