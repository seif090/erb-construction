import { Injectable } from '@angular/core';
import { BaseApiService, PaginatedResponse, ApiResponse } from './base-api.service';
import { Observable } from 'rxjs';

export interface Unit {
  id: string;
  name: string;
  type: 'APARTMENT' | 'VILLA' | 'STUDIO' | 'OFFICE' | 'LAND' | 'OTHER';
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'RENTED' | 'MAINTENANCE';
  price: number;
  area: number;
  rooms?: number;
  baths?: number;
  location?: string;
  projectId?: string;
  project?: { name: string };
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseApiService {
  private readonly endpoint = 'units';

  getUnits(params?: any): Observable<PaginatedResponse<Unit>> {
    return this.get<Unit[]>(this.endpoint, params) as Observable<PaginatedResponse<Unit>>;
  }

  getUnitById(id: string): Observable<ApiResponse<Unit>> {
    return this.get<Unit>(`${this.endpoint}/${id}`);
  }

  createUnit(data: Partial<Unit>): Observable<ApiResponse<Unit>> {
    return this.post<Unit>(this.endpoint, data);
  }

  updateUnit(id: string, data: Partial<Unit>): Observable<ApiResponse<Unit>> {
    return this.patch<Unit>(`${this.endpoint}/${id}`, data);
  }

  deleteUnit(id: string): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}
