import { Injectable } from '@angular/core';
import { BaseApiService, PaginatedResponse, ApiResponse } from './base-api.service';
import { Observable } from 'rxjs';

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  category: string;
  projectId?: string;
  project?: { name: string };
  date: string;
  reference?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface AccountingSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService extends BaseApiService {
  private readonly endpoint = 'accounting';

  getTransactions(params?: any): Observable<PaginatedResponse<Transaction>> {
    return this.get<Transaction[]>(`${this.endpoint}/transactions`, params) as Observable<PaginatedResponse<Transaction>>;
  }

  getSummary(): Observable<ApiResponse<AccountingSummary>> {
    return this.get<AccountingSummary>(`${this.endpoint}/summary`);
  }

  createTransaction(data: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.endpoint}/transactions`, data);
  }

  updateTransaction(id: string, data: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.patch<Transaction>(`${this.endpoint}/transactions/${id}`, data);
  }

  deleteTransaction(id: string): Observable<ApiResponse<any>> {
    return this.delete(`${this.endpoint}/transactions/${id}`);
  }
}
