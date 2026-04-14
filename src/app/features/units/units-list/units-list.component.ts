import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Search, Building, MapPin, Bed, Bath, Move, MoreVertical, Plus } from 'lucide-angular';

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './units-list.component.html',
  styleUrl: './units-list.component.scss'
})
export class UnitsListComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/units`;

  units = signal<any[]>([]);
  filteredUnits = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  readonly Search = Search;
  readonly Building = Building;
  readonly MapPin = MapPin;
  readonly Bed = Bed;
  readonly Bath = Bath;
  readonly Move = Move;
  readonly MoreVertical = MoreVertical;
  readonly Plus = Plus;

  ngOnInit() {
    this.fetchUnits();
  }

  fetchUnits() {
    this.isLoading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.units.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching units:', err);
        // Fallback mock data
        const mockData = [
          { 
            id: '1', 
            title: 'شقة فاخرة في الياسمين', 
            type: 'APARTMENT', 
            price: 4500000, 
            area: 180, 
            bedrooms: 3, 
            bathrooms: 2, 
            status: 'AVAILABLE', 
            city: 'القاهرة', 
            district: 'التجمع الخامس' 
          },
          { 
            id: '2', 
            title: 'فيلا مودرن مع مسبح', 
            type: 'VILLA', 
            price: 12000000, 
            area: 450, 
            bedrooms: 5, 
            bathrooms: 4, 
            status: 'RESERVED', 
            city: 'الرياض', 
            district: 'حي الملقا' 
          },
          { 
            id: '3', 
            title: 'محل تجاري للايجار', 
            type: 'SHOP', 
            price: 850000, 
            rentPrice: 5000,
            area: 55, 
            status: 'AVAILABLE', 
            city: 'جدة', 
            district: 'حي الشاطئ' 
          },
        ];
        this.units.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredUnits.set(this.units());
      return;
    }
    const filtered = this.units().filter(u => 
      u.title.toLowerCase().includes(query) || 
      u.city.toLowerCase().includes(query) ||
      u.district.toLowerCase().includes(query)
    );
    this.filteredUnits.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'AVAILABLE': return 'bg-success/10 text-success';
      case 'SOLD': return 'bg-error/10 text-error';
      case 'RENTED': return 'bg-blue-500/10 text-blue-500';
      case 'RESERVED': return 'bg-warning/10 text-warning';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'AVAILABLE': return 'متاح';
      case 'SOLD': return 'مباع';
      case 'RENTED': return 'مؤجر';
      case 'RESERVED': return 'محجوز';
      default: return status;
    }
  }

  getTypeLabel(type: string) {
    switch (type) {
      case 'APARTMENT': return 'شقة';
      case 'VILLA': return 'فيلا';
      case 'SHOP': return 'محل';
      case 'OFFICE': return 'مكتب';
      default: return type;
    }
  }
}
