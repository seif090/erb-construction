import { Injectable } from '@angular/core';
import { BaseApiService, PaginatedResponse, ApiResponse } from './base-api.service';
import { Observable } from 'rxjs';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  supplier?: string;
  location?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseApiService {
  private readonly endpoint = 'inventory';

  getItems(params?: any): Observable<PaginatedResponse<InventoryItem>> {
    return this.get<InventoryItem[]>(this.endpoint, params) as Observable<PaginatedResponse<InventoryItem>>;
  }

  getItemById(id: string): Observable<ApiResponse<InventoryItem>> {
    return this.get<InventoryItem>(`${this.endpoint}/${id}`);
  }

  createItem(data: Partial<InventoryItem>): Observable<ApiResponse<InventoryItem>> {
    return this.post<InventoryItem>(this.endpoint, data);
  }

  updateItem(id: string, data: Partial<InventoryItem>): Observable<ApiResponse<InventoryItem>> {
    return this.patch<InventoryItem>(`${this.endpoint}/${id}`, data);
  }

  deleteItem(id: string): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  recordMovement(id: string, movement: { type: 'IN' | 'OUT'; quantity: number; reason?: string }): Observable<ApiResponse<any>> {
    return this.post(`${this.endpoint}/${id}/movements`, movement);
  }
}
