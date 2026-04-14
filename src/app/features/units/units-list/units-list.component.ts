import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UnitService, Unit } from '../../../core/services/unit.service';
import { UnitFormComponent } from '../unit-form/unit-form.component';
import { LucideAngularModule, Search, Building, MapPin, Bed, Bath, Move, MoreVertical, Plus, Home } from 'lucide-angular';

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, MatDialogModule],
  templateUrl: './units-list.component.html',
  styleUrl: './units-list.component.scss'
})
export class UnitsListComponent implements OnInit {
  private unitService = inject(UnitService);
  private dialog = inject(MatDialog);

  units = signal<Unit[]>([]);
  filteredUnits = signal<Unit[]>([]);
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
  readonly Home = Home;

  ngOnInit() {
    this.fetchUnits();
  }

  fetchUnits() {
    this.isLoading.set(true);
    this.unitService.getUnits().subscribe({
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
        const mockData: Unit[] = [
          { 
            id: '1', 
            name: 'Ø´Ù‚Ø© ÙØ§Ø®Ø±Ø© ÙÙŠ Ø§Ù„ÙŠØ§Ø³Ù…ÙŠÙ†', 
            type: 'APARTMENT', 
            price: 4500000, 
            area: 180, 
            rooms: 3, 
            baths: 2, 
            status: 'AVAILABLE', 
            location: 'Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©ØŒ Ø§Ù„ØªØ¬Ù…Ø¹ Ø§Ù„Ø®Ø§Ù…Ø³',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          { 
            id: '2', 
            name: 'ÙÙŠÙ„Ø§ Ù…ÙˆØ¯Ø±Ù† Ù…Ø¹ Ù…Ø³Ø¨Ø­', 
            type: 'VILLA', 
            price: 12000000, 
            area: 450, 
            rooms: 5, 
            baths: 4, 
            status: 'RESERVED', 
            location: 'Ø§Ù„Ø±ÙŠØ§Ø¶ØŒ Ø­ÙŠ Ø§Ù„Ù…Ù„Ù‚Ø§',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
        ];
        this.units.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  openUnitForm(unit?: Unit) {
    const dialogRef = this.dialog.open(UnitFormComponent, {
      width: '700px',
      data: { unit },
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUnits();
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
      u.name.toLowerCase().includes(query) || 
      u.location?.toLowerCase().includes(query)
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
      case 'AVAILABLE': return 'Ù…ØªØ§Ø­';
      case 'SOLD': return 'Ù…Ø¨Ø§Ø¹';
      case 'RENTED': return 'Ù…Ø¤Ø¬Ø±';
      case 'RESERVED': return 'Ù…Ø­Ø¬ÙˆØ²';
      default: return status;
    }
  }

  getTypeLabel(type: string) {
    switch (type) {
      case 'APARTMENT': return 'Ø´Ù‚Ø©';
      case 'VILLA': return 'ÙÙŠÙ„Ø§';
      case 'STUDIO': return 'Ø§Ø³ØªÙˆØ¯ÙŠÙˆ';
      case 'OFFICE': return 'Ù…ÙƒØªØ¨';
      case 'LAND': return 'Ø£Ø±Ø¶';
      default: return type;
    }
  }
}

