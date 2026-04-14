import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientService, Client } from '../../../core/services/client.service';
import { LucideAngularModule, X, Save, User, Mail, Phone, MapPin, DollarSign } from 'lucide-angular';

@Component({
  selector: 'app-client-form',
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
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private dialogRef = inject(MatDialogRef<ClientFormComponent>);

  clientForm: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);

  readonly X = X;
  readonly Save = Save;
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly DollarSign = DollarSign;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { client?: Client }) {
    this.isEdit = !!data?.client;
    this.clientForm = this.fb.group({
      name: [data?.client?.name || '', [Validators.required]],
      email: [data?.client?.email || '', [Validators.required, Validators.email]],
      phone: [data?.client?.phone || '', [Validators.required]],
      address: [data?.client?.address || ''],
      pipeline: [data?.client?.pipeline || 'LEAD', [Validators.required]],
      totalValue: [data?.client?.totalValue || 0]
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.clientForm.value;

    if (this.isEdit && this.data.client) {
      this.clientService.updateClient(this.data.client.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.clientService.createClient(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}

