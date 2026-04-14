import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Search, Box, AlertTriangle, ArrowUpDown, MoreVertical, Plus, Package } from 'lucide-angular';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss'
})
export class InventoryListComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventory`;

  items = signal<any[]>([]);
  filteredItems = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  readonly Search = Search;
  readonly Box = Box;
  readonly AlertTriangle = AlertTriangle;
  readonly ArrowUpDown = ArrowUpDown;
  readonly MoreVertical = MoreVertical;
  readonly Plus = Plus;
  readonly Package = Package;

  ngOnInit() {
    this.fetchInventory();
  }

  fetchInventory() {
    this.isLoading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.items.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching inventory:', err);
        // Fallback mock data
        const mockData = [
          { id: '1', name: 'أسمنت بورتلاندي', category: 'مواد بناء', quantity: 50, minQuantity: 100, unit: 'TON', unitPrice: 4500, location: 'مخزن أ' },
          { id: '2', name: 'دهان جوتن أبيض', category: 'دهانات', quantity: 150, minQuantity: 50, unit: 'LITER', unitPrice: 850, location: 'مخزن ب' },
          { id: '3', name: 'خشب سويدي 2*4', category: 'أخشاب', quantity: 500, minQuantity: 200, unit: 'PIECE', unitPrice: 120, location: 'مخزن أ' },
          { id: '4', name: 'كابلات سويدي 4مم', category: 'كهرباء', quantity: 5, minQuantity: 10, unit: 'BOX', unitPrice: 3200, location: 'مخزن ج' },
        ];
        this.items.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredItems.set(this.items());
      return;
    }
    const filtered = this.items().filter(i => 
      i.name.toLowerCase().includes(query) || 
      i.category.toLowerCase().includes(query) ||
      i.location.toLowerCase().includes(query)
    );
    this.filteredItems.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  isLowStock(item: any) {
    return item.quantity < item.minQuantity;
  }

  getUnitLabel(unit: string) {
    switch (unit) {
      case 'PIECE': return 'قطعة';
      case 'METER': return 'متر';
      case 'TON': return 'طن';
      case 'LITER': return 'لتر';
      case 'BOX': return 'صندوق';
      case 'KG': return 'كجم';
      default: return unit;
    }
  }
}
