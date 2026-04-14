import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContractorService, Contractor } from '../../../core/services/contractor.service';
import { ContractorFormComponent } from '../contractor-form/contractor-form.component';
import { LucideAngularModule, Search, HardHat, Phone, Mail, Star, MoreVertical, Plus, Briefcase } from 'lucide-angular';

@Component({
  selector: 'app-contractors-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, MatDialogModule],
  templateUrl: './contractors-list.component.html',
  styleUrl: './contractors-list.component.scss'
})
export class ContractorsListComponent implements OnInit {
  private contractorService = inject(ContractorService);
  private dialog = inject(MatDialog);

  contractors = signal<Contractor[]>([]);
  filteredContractors = signal<Contractor[]>([]);
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
    this.contractorService.getContractors().subscribe({
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
        const mockData: Contractor[] = [
          { id: '1', name: 'ÙŠÙˆØ³Ù Ø§Ø¨Ø±Ø§Ù‡ÙŠÙ…', specialty: 'ELECTRICIAN', specialties: [], phone: '0101234567', email: 'youssef@electric.com', rating: 5, isActive: true, totalProjects: 12, createdAt: '', updatedAt: '' },
          { id: '2', name: 'Ø®Ø§Ù„Ø¯ Ù…Ù…Ø¯ÙˆØ­', specialty: 'PLUMBER', specialties: [], phone: '0119876543', email: 'khaled@plumbing.com', rating: 4, isActive: true, totalProjects: 8, createdAt: '', updatedAt: '' },
          { id: '3', name: 'Ø³Ù†Ø§Ø¡ Ù…Ø­Ù…ÙˆØ¯', specialty: 'DESIGNER', specialties: [], phone: '0123344556', email: 'sanaa@design.com', rating: 5, isActive: true, totalProjects: 5, createdAt: '', updatedAt: '' },
          { id: '4', name: 'Ù…Ø­Ù…ÙˆØ¯ Ø¹Ù„ÙŠ', specialty: 'PAINTER', specialties: [], phone: '0156677889', email: 'mahmoud@paint.com', rating: 3, isActive: false, totalProjects: 20, createdAt: '', updatedAt: '' },
        ];
        this.contractors.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  openContractorForm(contractor?: Contractor) {
    const dialogRef = this.dialog.open(ContractorFormComponent, {
      width: '600px',
      data: { contractor },
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchContractors();
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
      c.specialty.toLowerCase().includes(query)
    );
    this.filteredContractors.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  getTradeLabel(specialty: string) {
    switch (specialty) {
      case 'ELECTRICIAN': return 'ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠ';
      case 'PLUMBER': return 'Ø³Ø¨Ø§Ùƒ';
      case 'PAINTER': return 'Ù†Ù‚Ø§Ø´ / Ø¯Ù‡Ø§Ù†Ø§Øª';
      case 'CARPENTER': return 'Ù†Ø¬Ø§Ø±';
      case 'MASON': return 'Ø¨Ù†Ø§Ø¡ / Ù…Ù‚Ø§ÙˆÙ„ Ø¹Ø§Ù…';
      case 'ARCHITECT': return 'Ù…Ù‡Ù†Ø¯Ø³ Ù…Ø¹Ù…Ø§Ø±ÙŠ';
      case 'DESIGNER': return 'Ù…ØµÙ…Ù… Ø¯ÙŠÙƒÙˆØ±';
      default: return specialty;
    }
  }

  getStatusClass(isActive: boolean) {
    return isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error';
  }

  getStatusLabel(isActive: boolean) {
    return isActive ? 'Ù†Ø´Ø·' : 'ØºÙŠØ± Ù†Ø´Ø·';
  }
}

