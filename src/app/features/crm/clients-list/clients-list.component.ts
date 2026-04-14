import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientService, Client } from '../../../core/services/client.service';
import { ClientFormComponent } from '../client-form/client-form.component';
import { LucideAngularModule, Search, UserPlus, Filter, MoreVertical, Mail, Phone, MapPin, Star } from 'lucide-angular';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, MatDialogModule],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent implements OnInit {
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);

  clients = signal<Client[]>([]);
  filteredClients = signal<Client[]>([]);
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
    this.clientService.getClients().subscribe({
      next: (res) => {
        if (res.success) {
          this.clients.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
        // Fallback mock data for visual assessment until DB is live
        const mockData: Client[] = [
          { id: '1', name: 'Ø£Ø­Ù…Ø¯ Ø¹Ù„ÙŠ', email: 'ahmed@example.com', phone: '0123456789', pipeline: 'CLOSED', totalValue: 150000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', name: 'Ù…Ø­Ù…Ø¯ Ø­Ø³Ù†', email: 'mohammad@example.com', phone: '0112233445', pipeline: 'NEGOTIATION', totalValue: 85000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', name: 'Ø³Ø§Ø±Ø© Ù…Ø­Ù…ÙˆØ¯', email: 'sara@example.com', phone: '0101010101', pipeline: 'LEAD', totalValue: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '4', name: 'ÙŠØ§Ø³ÙŠÙ† ÙƒØ±ÙŠÙ…', email: 'yassin@example.com', phone: '0151515151', pipeline: 'PROPOSAL', totalValue: 45000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        this.clients.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  openClientForm(client?: Client) {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '600px',
      data: { client },
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchClients();
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
      case 'CLOSED': return 'Ù…ÙƒØªÙ…Ù„ / Closed';
      case 'LEAD': return 'Ø¹Ù…ÙŠÙ„ Ù…Ø­ØªÙ…Ù„ / Lead';
      case 'NEGOTIATION': return 'ØªÙØ§ÙˆØ¶ / Negotiation';
      case 'PROPOSAL': return 'Ø¹Ø±Ø¶ Ø³Ø¹Ø± / Proposal';
      case 'LOST': return 'Ù…ÙÙ‚ÙˆØ¯ / Lost';
      default: return stage;
    }
  }
}

