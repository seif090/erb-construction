import { Injectable } from '@angular/core';
import { BaseApiService, PaginatedResponse, ApiResponse } from './base-api.service';
import { Observable } from 'rxjs';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  rating?: number;
  pipeline: 'LEAD' | 'NEGOTIATION' | 'PROPOSAL' | 'CLOSED' | 'LOST';
  totalValue?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    projects: number;
    contracts: number;
  };
}

export interface ClientAttachment {
  id: string;
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
}

export interface CreateClientAttachmentDto {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
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
    return this.put<Client>(`${this.endpoint}/${id}`, data);
  }

  deleteClient(id: string): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  getPipelineData(): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.endpoint}/pipeline`);
  }

  getClientAttachments(clientId: string): Observable<ApiResponse<ClientAttachment[]>> {
    return this.get<ClientAttachment[]>(`${this.endpoint}/${clientId}/attachments`);
  }

  addClientAttachment(clientId: string, data: CreateClientAttachmentDto): Observable<ApiResponse<ClientAttachment>> {
    return this.post<ClientAttachment>(`${this.endpoint}/${clientId}/attachments`, data);
  }

  uploadClientAttachment(clientId: string, file: File, name?: string): Observable<ApiResponse<ClientAttachment>> {
    const formData = new FormData();
    formData.append('file', file);
    if (name) {
      formData.append('name', name);
    }
    return this.post<ClientAttachment>(`${this.endpoint}/${clientId}/attachments/upload`, formData);
  }

  deleteClientAttachment(clientId: string, attachmentId: string): Observable<ApiResponse<null>> {
    return this.delete<null>(`${this.endpoint}/${clientId}/attachments/${attachmentId}`);
  }
}
