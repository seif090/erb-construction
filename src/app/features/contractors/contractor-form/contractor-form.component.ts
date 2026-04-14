import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ContractorService, Contractor } from '../../../../core/services/contractor.service';
import { LucideAngularModule, X, Save, HardHat, Phone, Mail, MapPin, ClipboardList, Briefcase } from 'lucide-angular';

@Component({
  selector: 'app-contractor-form',
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
  templateUrl: './contractor-form.component.html',
  styleUrl: './contractor-form.component.scss'
})
export class ContractorFormComponent {
  private fb = inject(FormBuilder);
  private contractorService = inject(ContractorService);
  private dialogRef = inject(MatDialogRef<ContractorFormComponent>);

  contractorForm: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);

  readonly X = X;
  readonly Save = Save;
  readonly HardHat = HardHat;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly ClipboardList = ClipboardList;
  readonly Briefcase = Briefcase;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { contractor?: Contractor }) {
    this.isEdit = !!data?.contractor;
    this.contractorForm = this.fb.group({
      name: [data?.contractor?.name || '', [Validators.required]],
      phone: [data?.contractor?.phone || '', [Validators.required]],
      email: [data?.contractor?.email || ''],
      specialty: [data?.contractor?.specialty || 'ELECTRICIAN', [Validators.required]],
      dailyRate: [data?.contractor?.dailyRate || 0],
      address: [data?.contractor?.address || ''],
      notes: [data?.contractor?.notes || ''],
      isActive: [data?.contractor?.isActive !== undefined ? data.contractor.isActive : true]
    });
  }

  onSubmit() {
    if (this.contractorForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.contractorForm.value;

    if (this.isEdit && this.data.contractor) {
      this.contractorService.updateContractor(this.data.contractor.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.contractorService.createContractor(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
