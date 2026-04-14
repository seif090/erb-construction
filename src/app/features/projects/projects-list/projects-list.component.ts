import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Search, FolderPlus, MapPin, Calendar, Clock, MoreVertical, TrendingUp, CheckCircle2 } from 'lucide-angular';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  projects = signal<any[]>([]);
  filteredProjects = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  readonly Search = Search;
  readonly FolderPlus = FolderPlus;
  readonly MapPin = MapPin;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly MoreVertical = MoreVertical;
  readonly TrendingUp = TrendingUp;
  readonly CheckCircle2 = CheckCircle2;

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects() {
    this.isLoading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.projects.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        // Fallback mock data
        const mockData = [
          { 
            id: '1', 
            name: 'تشطيب فيلا الياسمين', 
            clientName: 'أحمد علي', 
            budget: 250000, 
            spent: 120000, 
            status: 'IN_PROGRESS', 
            progress: 45, 
            location: 'التجمع الخامس، القاهرة',
            startDate: '2023-10-01'
          },
          { 
            id: '2', 
            name: 'ديكور شقة الرحاب', 
            clientName: 'محمد حسن', 
            budget: 120000, 
            spent: 120000, 
            status: 'COMPLETED', 
            progress: 100, 
            location: 'الرحاب، القاهرة',
            startDate: '2023-08-15'
          },
          { 
            id: '3', 
            name: 'عمارة المهندسين', 
            clientName: 'سارة محمود', 
            budget: 1500000, 
            spent: 0, 
            status: 'PENDING', 
            progress: 0, 
            location: 'المهندسين، الجيزة',
            startDate: '2024-01-10'
          },
        ];
        this.projects.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredProjects.set(this.projects());
      return;
    }
    const filtered = this.projects().filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.clientName?.toLowerCase().includes(query) ||
      p.location?.toLowerCase().includes(query)
    );
    this.filteredProjects.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500';
      case 'COMPLETED': return 'bg-success/10 text-success';
      case 'PENDING': return 'bg-warning/10 text-warning';
      case 'ON_HOLD': return 'bg-slate-500/10 text-slate-500';
      case 'CANCELLED': return 'bg-error/10 text-error';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'IN_PROGRESS': return 'قيد التنفيذ';
      case 'COMPLETED': return 'مكتمل';
      case 'PENDING': return 'قيد الانتظار';
      case 'ON_HOLD': return 'متوقف مؤقتاً';
      case 'CANCELLED': return 'ملغي';
      default: return status;
    }
  }
}
