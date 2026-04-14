import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Search, HardHat, Phone, Mail, Star, MoreVertical, Plus, Briefcase } from 'lucide-angular';

@Component({
  selector: 'app-contractors-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './contractors-list.component.html',
  styleUrl: './contractors-list.component.scss'
})
export class ContractorsListComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contractors`;

  contractors = signal<any[]>([]);
  filteredContractors = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  readonly Search = Search;
  readonly HardHat = HardHat;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Star = Star;
  readonly MoreVertical = MoreVertical;
  readonly Plus = Plus;
  readonly Briefcase = Briefcase;

  ngOnInit() {
    this.fetchContractors();
  }

  fetchContractors() {
    this.isLoading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.contractors.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching contractors:', err);
        // Fallback mock data
        const mockData = [
          { id: '1', name: 'يوسف ابراهيم', trade: 'ELECTRICIAN', company: 'النور للكهرباء', phone: '0101234567', email: 'youssef@electric.com', rating: 5, status: 'ACTIVE' },
          { id: '2', name: 'خالد ممدوح', trade: 'PLUMBER', company: 'سباكة ممدوح', phone: '0119876543', email: 'khaled@plumbing.com', rating: 4, status: 'ACTIVE' },
          { id: '3', name: 'سناء محمود', trade: 'DESIGNER', company: 'مودرن ديزاين', phone: '0123344556', email: 'sanaa@design.com', rating: 5, status: 'ON_LEAVE' },
          { id: '4', name: 'محمود علي', trade: 'PAINTER', company: 'دهانات الجوهرة', phone: '0156677889', email: 'mahmoud@paint.com', rating: 3, status: 'INACTIVE' },
        ];
        this.contractors.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredContractors.set(this.contractors());
      return;
    }
    const filtered = this.contractors().filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.company?.toLowerCase().includes(query) ||
      c.trade.toLowerCase().includes(query)
    );
    this.filteredContractors.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  getTradeLabel(trade: string) {
    switch (trade) {
      case 'ELECTRICIAN': return 'كهربائي';
      case 'PLUMBER': return 'سباك';
      case 'PAINTER': return 'نقاش / دهانات';
      case 'CARPENTER': return 'نجار';
      case 'MASON': return 'بناء / مقاول عام';
      case 'ARCHITECT': return 'مهندس معماري';
      case 'DESIGNER': return 'مصمم ديكور';
      default: return trade;
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'ACTIVE': return 'bg-success/10 text-success';
      case 'INACTIVE': return 'bg-error/10 text-error';
      case 'ON_LEAVE': return 'bg-warning/10 text-warning';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'ACTIVE': return 'نشط';
      case 'INACTIVE': return 'غير نشط';
      case 'ON_LEAVE': return 'في إجازة';
      default: return status;
    }
  }
}
