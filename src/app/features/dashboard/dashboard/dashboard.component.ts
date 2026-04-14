import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { LucideAngularModule, TrendingUp, Users, Building2, HardHat, FileText, PiggyBank } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  stats: any = null;
  isLoading = true;
  error = '';

  readonly TrendingUp = TrendingUp;
  readonly Users = Users;
  readonly Building2 = Building2;
  readonly HardHat = HardHat;
  readonly FileText = FileText;
  readonly PiggyBank = PiggyBank;

  // Revenue Chart Configuration (Dummy Data until API loads)
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65000, 59000, 80000, 81000, 56000, 55000, 40000],
        label: 'الإيرادات / Revenue',
        backgroundColor: 'rgba(30, 58, 95, 0.2)',
        borderColor: '#1E3A5F',
        pointBackgroundColor: '#C9A84C',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#C9A84C',
        fill: 'origin',
      }
    ],
    labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: { tension: 0.5 }
    },
    scales: {
      y: { position: 'left' }
    },
    plugins: {
      legend: { display: true }
    }
  };
  public lineChartType: ChartType = 'line';

  // Projects Status Chart
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Pending'], ['In Progress'], ['Completed']],
    datasets: [{
      data: [300, 500, 100],
      backgroundColor: ['#F59E0B', '#1E3A5F', '#10B981']
    }]
  };
  public pieChartType: ChartType = 'pie';

  ngOnInit(): void {
    // Attempting to fetch stats from API if backend is running
    this.http.get<any>(`${this.apiUrl}/stats`).subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
          // Dynamically update charts if the backend returns array structures
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        // Fallback dummy data for visual testing if API fails
        this.stats = {
          totalClients: 45,
          activeProjects: 12,
          availableUnits: 8,
          totalContractors: 24,
          monthlyRevenue: 125000,
          pendingContracts: 3
        };
        this.isLoading = false;
      }
    });
  }
}
