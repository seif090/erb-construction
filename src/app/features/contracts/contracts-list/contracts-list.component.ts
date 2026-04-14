import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Search, FileSignature, Calendar, User, MoreVertical, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-contracts-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './contracts-list.component.html',
  styleUrl: './contracts-list.component.scss'
})
export class ContractsListComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contracts`;

  contracts = signal<any[]>([]);
  filteredContracts = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  readonly Search = Search;
  readonly FileSignature = FileSignature;
  readonly Calendar = Calendar;
  readonly User = User;
  readonly MoreVertical = MoreVertical;
  readonly Plus = Plus;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly AlertCircle = AlertCircle;

  ngOnInit() {
    this.fetchContracts();
  }

  fetchContracts() {
    this.isLoading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.contracts.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching contracts:', err);
        // Fallback mock data
        const mockData = [
          { id: '1', number: 'CNT-2023-001', type: 'CONSTRUCTION', clientName: 'أحمد علي', totalAmount: 250000, status: 'ACTIVE', startDate: '2023-10-01', endDate: '2024-03-31' },
          { id: '2', number: 'CNT-2023-002', type: 'SALES', clientName: 'محمد حسن', totalAmount: 4500000, status: 'ACTIVE', startDate: '2023-09-15', endDate: '2023-12-15' },
          { id: '3', number: 'CNT-2023-003', type: 'RENTAL', clientName: 'سارة محمود', totalAmount: 5000, status: 'EXPIRED', startDate: '2022-11-01', endDate: '2023-11-01' },
          { id: '4', number: 'CNT-2023-004', type: 'SERVICE', clientName: 'شركة الأمل', totalAmount: 15000, status: 'DRAFT', startDate: '2023-12-01', endDate: '2024-06-01' },
        ];
        this.contracts.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredContracts.set(this.contracts());
      return;
    }
    const filtered = this.contracts().filter(c => 
      c.number.toLowerCase().includes(query) || 
      c.clientName?.toLowerCase().includes(query) ||
      c.type.toLowerCase().includes(query)
    );
    this.filteredContracts.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  getTypeLabel(type: string) {
    switch (type) {
      case 'CONSTRUCTION': return 'عقد تشطيب / بناء';
      case 'SALES': return 'عقد بيع';
      case 'RENTAL': return 'عقد إيجار';
      case 'SERVICE': return 'عقد صيانة / خدمة';
      case 'EMPLOYMENT': return 'عقد عمل';
      default: return type;
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'ACTIVE': return 'bg-success/10 text-success';
      case 'EXPIRED': return 'bg-error/10 text-error';
      case 'DRAFT': return 'bg-slate-500/10 text-slate-500';
      case 'TERMINATED': return 'bg-error/10 text-error';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'ACTIVE': return 'ساري';
      case 'EXPIRED': return 'منتهي';
      case 'DRAFT': return 'مسودة';
      case 'TERMINATED': return 'ملغي';
      default: return status;
    }
  }
}
