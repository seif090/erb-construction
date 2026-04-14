import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Search, UserPlus, Filter, MoreVertical, Mail, Phone, MapPin, Star } from 'lucide-angular';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clients`;

  clients = signal<any[]>([]);
  filteredClients = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  readonly Search = Search;
  readonly UserPlus = UserPlus;
  readonly Filter = Filter;
  readonly MoreVertical = MoreVertical;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly Star = Star;

  ngOnInit() {
    this.fetchClients();
  }

  fetchClients() {
    this.isLoading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.clients.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
        // Fallback mock data for visual assessment
        const mockData = [
          { id: '1', name: 'أحمد علي', email: 'ahmed@example.com', phone: '0123456789', pipeline: 'CLOSED', totalValue: 150000, rating: 5, address: 'القاهرة' },
          { id: '2', name: 'محمد حسن', email: 'mohammad@example.com', phone: '0112233445', pipeline: 'NEGOTIATION', totalValue: 85000, rating: 4, address: 'الرياض' },
          { id: '3', name: 'سارة محمود', email: 'sara@example.com', phone: '0101010101', pipeline: 'LEAD', totalValue: 0, rating: 3, address: 'دبي' },
          { id: '4', name: 'ياسين كريم', email: 'yassin@example.com', phone: '0151515151', pipeline: 'PROPOSAL', totalValue: 45000, rating: 4, address: 'جدة' },
        ];
        this.clients.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredClients.set(this.clients());
      return;
    }
    const filtered = this.clients().filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.email?.toLowerCase().includes(query) || 
      c.phone.includes(query)
    );
    this.filteredClients.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  getPipelineClass(stage: string) {
    switch (stage) {
      case 'CLOSED': return 'bg-success/10 text-success';
      case 'LEAD': return 'bg-blue-500/10 text-blue-500';
      case 'NEGOTIATION': return 'bg-warning/10 text-warning';
      case 'PROPOSAL': return 'bg-purple-500/10 text-purple-500';
      case 'LOST': return 'bg-error/10 text-error';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  }

  getPipelineLabel(stage: string) {
    switch (stage) {
      case 'CLOSED': return 'مكتمل / Closed';
      case 'LEAD': return 'عميل محتمل / Lead';
      case 'NEGOTIATION': return 'تفاوض / Negotiation';
      case 'PROPOSAL': return 'عرض سعر / Proposal';
      case 'LOST': return 'مفقود / Lost';
      default: return stage;
    }
  }
}
