import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, Folder, Building, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, UserPlus, HardHat, Building2, PiggyBank } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService, DashboardKPIs } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  isLoading = signal(true);
  stats = signal<DashboardKPIs | null>(null);

  readonly Users = Users;
  readonly Folder = Folder;
  readonly Building = Building;
  readonly HardHat = HardHat;
  readonly Building2 = Building2;
  readonly PiggyBank = PiggyBank;
  readonly TrendingUp = TrendingUp;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownRight = ArrowDownRight;
  readonly Clock = Clock;
  readonly CheckCircle2 = CheckCircle2;
  readonly UserPlus = UserPlus;

  // Chart configurations handled by a helper method to avoid clutter
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [65, 59, 80, 81, 56, 55], label: 'Revenue', backgroundColor: '#1E3A5F', borderRadius: 8 }]
  };

  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
  };
  public lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [120000, 140000, 90000, 165000, 150000, 180000], label: 'Income', borderColor: '#1E3A5F', backgroundColor: 'rgba(30,58,95,0.15)', tension: 0.35, fill: true }]
  };

  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{ data: [3, 8, 4], backgroundColor: ['#f59e0b', '#1E3A5F', '#10b981'] }]
  };

  get totalClients(): number {
    return this.stats()?.clients.total ?? 0;
  }

  get activeProjects(): number {
    return this.stats()?.projects.active ?? 0;
  }

  get availableUnits(): number {
    return this.stats()?.units.available ?? 0;
  }

  get monthlyRevenue(): number {
    return this.stats()?.financial.incomeThisMonth ?? 0;
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.dashboardService.getKPIs().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.set(res.data);
          // Here you would also update chart data from actual API results
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        // Fallback mock data for visual presentation
        this.stats.set({
          projects: { total: 12, active: 8, completed: 4 },
          clients: { total: 45, newThisMonth: 5 },
          units: { total: 24, available: 6, occupancyRate: 75 },
          financial: {
            totalIncome: 1250000,
            totalExpense: 450000,
            netProfit: 800000,
            incomeThisMonth: 120000,
            expenseThisMonth: 35000
          }
        });
        this.isLoading.set(false);
      }
    });
  }
}

