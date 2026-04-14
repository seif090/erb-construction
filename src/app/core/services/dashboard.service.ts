import { Injectable } from '@angular/core';
import { BaseApiService, ApiResponse } from './base-api.service';
import { Observable } from 'rxjs';

export interface DashboardKPIs {
  projects: { total: number; active: number; completed: number };
  clients: { total: number; newThisMonth: number };
  units: { total: number; available: number; occupancyRate: string | number };
  financial: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    incomeThisMonth: number;
    expenseThisMonth: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseApiService {
  private readonly endpoint = 'dashboard';

  getKPIs(): Observable<ApiResponse<DashboardKPIs>> {
    return this.get<DashboardKPIs>(`${this.endpoint}/stats`);
  }

  getRecentActivity(): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.endpoint}/activity`);
  }

  getProjectStatusChart(): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.endpoint}/charts/projects`);
  }

  getUnitStatusChart(): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.endpoint}/charts/units`);
  }
}
