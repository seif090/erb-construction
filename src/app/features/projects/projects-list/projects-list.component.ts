import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectService, Project } from '../../../core/services/project.service';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { LucideAngularModule, Search, FolderPlus, MapPin, Calendar, Clock, MoreVertical, TrendingUp, CheckCircle2 } from 'lucide-angular';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, MatDialogModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);

  projects = signal<Project[]>([]);
  filteredProjects = signal<Project[]>([]);
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
    this.projectService.getProjects().subscribe({
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
        const mockData: Project[] = [
          { 
            id: '1', 
            name: 'ØªØ´Ø·ÙŠØ¨ ÙÙŠÙ„Ø§ Ø§Ù„ÙŠØ§Ø³Ù…ÙŠÙ†', 
            budget: 250000, 
            spent: 120000, 
            status: 'IN_PROGRESS', 
            location: 'Ø§Ù„ØªØ¬Ù…Ø¹ Ø§Ù„Ø®Ø§Ù…Ø³ØŒ Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©',
            startDate: '2023-10-01',
            clientId: '1',
            client: { name: 'Ø£Ø­Ù…Ø¯ Ø¹Ù„ÙŠ' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          { 
            id: '2', 
            name: 'Ø¯ÙŠÙƒÙˆØ± Ø´Ù‚Ø© Ø§Ù„Ø±Ø­Ø§Ø¨', 
            budget: 120000, 
            spent: 120000, 
            status: 'COMPLETED', 
            location: 'Ø§Ù„Ø±Ø­Ø§Ø¨ØŒ Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©',
            startDate: '2023-08-15',
            clientId: '2',
            client: { name: 'Ù…Ø­Ù…Ø¯ Ø­Ø³Ù†' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
        ];
        this.projects.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  openProjectForm(project?: Project) {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '700px',
      data: { project },
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchProjects();
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
      p.client?.name?.toLowerCase().includes(query) ||
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
      case 'IN_PROGRESS': return 'Ù‚ÙŠØ¯ Ø§Ù„ØªÙ†ÙÙŠØ°';
      case 'COMPLETED': return 'Ù…ÙƒØªÙ…Ù„';
      case 'PENDING': return 'Ù‚ÙŠØ¯ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±';
      case 'ON_HOLD': return 'Ù…ØªÙˆÙ‚Ù Ù…Ø¤Ù‚ØªØ§Ù‹';
      case 'CANCELLED': return 'Ù…Ù„ØºÙŠ';
      default: return status;
    }
  }

  getProgress(p: Project): number {
    return (p.spent / p.budget) * 100;
  }
}

