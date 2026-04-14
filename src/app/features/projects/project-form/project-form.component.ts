import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ProjectService, Project } from '../../../core/services/project.service';
import { ClientService, Client } from '../../../core/services/client.service';
import { LucideAngularModule, X, Save, Folder, User, Calendar, DollarSign, MapPin, ClipboardList } from 'lucide-angular';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LucideAngularModule
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private clientService = inject(ClientService);
  private dialogRef = inject(MatDialogRef<ProjectFormComponent>);

  projectForm: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);
  clients = signal<Client[]>([]);

  readonly X = X;
  readonly Save = Save;
  readonly Folder = Folder;
  readonly User = User;
  readonly Calendar = Calendar;
  readonly DollarSign = DollarSign;
  readonly MapPin = MapPin;
  readonly ClipboardList = ClipboardList;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { project?: Project }) {
    this.isEdit = !!data?.project;
    this.projectForm = this.fb.group({
      name: [data?.project?.name || '', [Validators.required]],
      clientId: [data?.project?.clientId || '', [Validators.required]],
      status: [data?.project?.status || 'PENDING', [Validators.required]],
      budget: [data?.project?.budget || 0, [Validators.required, Validators.min(0)]],
      spent: [data?.project?.spent || 0, [Validators.min(0)]],
      location: [data?.project?.location || ''],
      startDate: [data?.project?.startDate ? new Date(data.project.startDate) : null],
      endDate: [data?.project?.endDate ? new Date(data.project.endDate) : null],
      description: [data?.project?.description || '']
    });

    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (res) => {
        if (res.success) {
          this.clients.set(res.data);
        }
      }
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.projectForm.value;

    if (this.isEdit && this.data.project) {
      this.projectService.updateProject(this.data.project.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.projectService.createProject(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}

