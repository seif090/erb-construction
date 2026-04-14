import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { InventoryService, InventoryItem } from '../../../core/services/inventory.service';
import { LucideAngularModule, X, Save, Package, Tag, Move, DollarSign, MapPin, ClipboardList } from 'lucide-angular';

@Component({
  selector: 'app-inventory-form',
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
  templateUrl: './inventory-form.component.html',
  styleUrl: './inventory-form.component.scss'
})
export class InventoryFormComponent {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private dialogRef = inject(MatDialogRef<InventoryFormComponent>);

  inventoryForm: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);

  readonly X = X;
  readonly Save = Save;
  readonly Package = Package;
  readonly Tag = Tag;
  readonly Move = Move;
  readonly DollarSign = DollarSign;
  readonly MapPin = MapPin;
  readonly ClipboardList = ClipboardList;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { item?: InventoryItem }) {
    this.isEdit = !!data?.item;
    this.inventoryForm = this.fb.group({
      name: [data?.item?.name || '', [Validators.required]],
      category: [data?.item?.category || 'Ù…ÙˆØ§Ø¯ Ø¨Ù†Ø§Ø¡', [Validators.required]],
      unit: [data?.item?.unit || 'PIECE', [Validators.required]],
      quantity: [data?.item?.quantity || 0, [Validators.required, Validators.min(0)]],
      minQuantity: [data?.item?.minQuantity || 0],
      unitCost: [data?.item?.unitCost || 0, [Validators.required, Validators.min(0)]],
      sku: [data?.item?.sku || ''],
      location: [data?.item?.location || ''],
      supplier: [data?.item?.supplier || '']
    });
  }

  onSubmit() {
    if (this.inventoryForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.inventoryForm.value;

    if (this.isEdit && this.data.item) {
      this.inventoryService.updateItem(this.data.item.id, formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.inventoryService.createItem(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}

