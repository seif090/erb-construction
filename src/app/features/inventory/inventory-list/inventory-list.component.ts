import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InventoryService, InventoryItem } from '../../../../core/services/inventory.service';
import { InventoryFormComponent } from '../inventory-form/inventory-form.component';
import { LucideAngularModule, Search, Box, AlertTriangle, ArrowUpDown, MoreVertical, Plus, Package } from 'lucide-angular';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, MatDialogModule],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss'
})
export class InventoryListComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);

  items = signal<InventoryItem[]>([]);
  filteredItems = signal<InventoryItem[]>([]);
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
    this.inventoryService.getItems().subscribe({
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
        const mockData: InventoryItem[] = [
          { id: '1', name: 'أسمنت بورتلاندي', category: 'مواد بناء', quantity: 50, minQuantity: 100, unit: 'TON', unitCost: 4500, location: 'مخزن أ', createdAt: '', updatedAt: '' },
          { id: '2', name: 'دهان جوتن أبيض', category: 'دهانات', quantity: 150, minQuantity: 50, unit: 'LITER', unitCost: 850, location: 'مخزن ب', createdAt: '', updatedAt: '' },
          { id: '3', name: 'خشب سويدي 2*4', category: 'أخشاب', quantity: 500, minQuantity: 200, unit: 'PIECE', unitCost: 120, location: 'مخزن أ', createdAt: '', updatedAt: '' },
        ];
        this.items.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  openItemForm(item?: InventoryItem) {
    const dialogRef = this.dialog.open(InventoryFormComponent, {
      width: '600px',
      data: { item },
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchInventory();
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
      i.location?.toLowerCase().includes(query)
    );
    this.filteredItems.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  isLowStock(item: InventoryItem) {
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
