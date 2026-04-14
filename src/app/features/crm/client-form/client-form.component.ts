import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientAttachment, ClientService, Client } from '../../../core/services/client.service';
import { LucideAngularModule, X, Save, User, Mail, Phone, MapPin, DollarSign, Paperclip, Plus, Trash2, Link2 } from 'lucide-angular';

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
  attachmentForm: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);
  isUploadingAttachment = signal(false);
  attachments = signal<ClientAttachment[]>([]);

  readonly X = X;
  readonly Save = Save;
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly DollarSign = DollarSign;
  readonly Paperclip = Paperclip;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Link2 = Link2;

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

    this.attachmentForm = this.fb.group({
      name: ['', [Validators.required]],
      url: ['', [Validators.required]],
      mimeType: [''],
      size: [null],
    });

    if (this.isEdit && data.client?.id) {
      this.loadAttachments(data.client.id);
    }
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

  loadAttachments(clientId: string) {
    this.clientService.getClientAttachments(clientId).subscribe({
      next: (res) => {
        if (res.success) {
          this.attachments.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading client attachments:', err);
      },
    });
  }

  addAttachment() {
    if (!this.data.client?.id || this.attachmentForm.invalid) {
      this.attachmentForm.markAllAsTouched();
      return;
    }

    this.isUploadingAttachment.set(true);
    const payload = this.attachmentForm.value;
    this.clientService.addClientAttachment(this.data.client.id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.attachments.set([res.data, ...this.attachments()]);
          this.attachmentForm.reset({ name: '', url: '', mimeType: '', size: null });
        }
        this.isUploadingAttachment.set(false);
      },
      error: (err) => {
        console.error('Error adding attachment:', err);
        this.isUploadingAttachment.set(false);
      },
    });
  }

  removeAttachment(attachmentId: string) {
    if (!this.data.client?.id) {
      return;
    }

    this.clientService.deleteClientAttachment(this.data.client.id, attachmentId).subscribe({
      next: (res) => {
        if (res.success) {
          this.attachments.set(this.attachments().filter((item) => item.id !== attachmentId));
        }
      },
      error: (err) => {
        console.error('Error deleting attachment:', err);
      },
    });
  }
}

