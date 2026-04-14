import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UnitService, Unit } from '../../../core/services/unit.service';
import { ProjectService, Project } from '../../../core/services/project.service';
import { LucideAngularModule, X, Save, Building, Home, Move, DollarSign, MapPin, ClipboardList } from 'lucide-angular';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    LucideAngularModule
  ],
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.scss'
})
export class UnitFormComponent {
  private fb = inject(FormBuilder);
  private unitService = inject(UnitService);
  private projectService = inject(ProjectService);
  private dialogRef = inject(MatDialogRef<UnitFormComponent>);

  unitForm: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);
  projects = signal<Project[]>([]);

  readonly X = X;
  readonly Save = Save;
  readonly Building = Building;
  readonly Home = Home;
  readonly Move = Move;
  readonly DollarSign = DollarSign;
  readonly MapPin = MapPin;
  readonly ClipboardList = ClipboardList;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { unit?: Unit }) {
    this.isEdit = !!data?.unit;
    this.unitForm = this.fb.group({
      name: [data?.unit?.name || '', [Validators.required]],
      projectId: [data?.unit?.projectId || ''],
      type: [data?.unit?.type || 'APARTMENT', [Validators.required]],
      status: [data?.unit?.status || 'AVAILABLE', [Validators.required]],
      price: [data?.unit?.price || 0, [Validators.required, Validators.min(0)]],
      area: [data?.unit?.area || 0, [Validators.required, Validators.min(0)]],
      rooms: [data?.unit?.rooms || 0],
      baths: [data?.unit?.baths || 0],
      location: [data?.unit?.location || ''],
    });

    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (res) => {
        if (res.success) {
          this.projects.set(res.data);
        }
      }
    });
  }

  onSubmit() {
    if (this.unitForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.unitForm.value;

    if (this.isEdit && this.data.unit) {
      this.unitService.updateUnit(this.data.unit.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.unitService.createUnit(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}

