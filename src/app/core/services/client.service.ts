import { Injectable } from '@angular/core';
import { BaseApiService, PaginatedResponse, ApiResponse } from './base-api.service';
import { Observable } from 'rxjs';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  pipeline: 'LEAD' | 'NEGOTIATION' | 'PROPOSAL' | 'CLOSED' | 'LOST';
  totalValue?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    projects: number;
    contracts: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseApiService {
  private readonly endpoint = 'clients';

  getClients(params?: any): Observable<PaginatedResponse<Client>> {
    return this.get<Client[]>(this.endpoint, params) as Observable<PaginatedResponse<Client>>;
  }

  getClientById(id: string): Observable<ApiResponse<Client>> {
    return this.get<Client>(`${this.endpoint}/${id}`);
  }

  createClient(data: Partial<Client>): Observable<ApiResponse<Client>> {
    return this.post<Client>(this.endpoint, data);
  }

  updateClient(id: string, data: Partial<Client>): Observable<ApiResponse<Client>> {
    return this.patch<Client>(`${this.endpoint}/${id}`, data);
  }

  deleteClient(id: string): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  getPipelineData(): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.endpoint}/pipeline`);
  }
}
