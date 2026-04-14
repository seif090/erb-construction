import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AccountingService, Transaction } from '../../../../core/services/accounting.service';
import { ProjectService, Project } from '../../../../core/services/project.service';
import { LucideAngularModule, X, Save, DollarSign, FileText, Calendar, Tag, Folder } from 'lucide-angular';

@Component({
  selector: 'app-transaction-form',
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
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent {
  private fb = inject(FormBuilder);
  private accountingService = inject(AccountingService);
  private projectService = inject(ProjectService);
  private dialogRef = inject(MatDialogRef<TransactionFormComponent>);

  transactionForm: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);
  projects = signal<Project[]>([]);

  readonly X = X;
  readonly Save = Save;
  readonly DollarSign = DollarSign;
  readonly FileText = FileText;
  readonly Calendar = Calendar;
  readonly Tag = Tag;
  readonly Folder = Folder;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { transaction?: Transaction }) {
    this.isEdit = !!data?.transaction;
    this.transactionForm = this.fb.group({
      type: [data?.transaction?.type || 'EXPENSE', [Validators.required]],
      amount: [data?.transaction?.amount || 0, [Validators.required, Validators.min(0.01)]],
      description: [data?.transaction?.description || '', [Validators.required]],
      category: [data?.transaction?.category || 'General', [Validators.required]],
      projectId: [data?.transaction?.projectId || ''],
      date: [data?.transaction?.date ? new Date(data.transaction.date) : new Date(), [Validators.required]],
      reference: [data?.transaction?.reference || '']
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
    if (this.transactionForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.transactionForm.value;

    if (this.isEdit && this.data.transaction) {
      this.accountingService.updateTransaction(this.data.transaction.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.accountingService.createTransaction(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
