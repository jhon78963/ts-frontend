import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SuppliersService } from '../../services/suppliers.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Supplier } from '../../models/suppliers.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-suppliers-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, KeyFilterModule],
  templateUrl: './suppliers-form.component.html',
  styleUrl: './suppliers-form.component.scss',
})
export class SuppliersFormComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly suppliersService: SuppliersService,
    private readonly dialogRef: DynamicDialogRef,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ) {}
  form: FormGroup = this.formBuilder.group({
    ruc: ['', Validators.required],
    businessName: ['', Validators.required],
    manager: ['', Validators.required],
    address: ['', Validators.required],
  });
  ngOnInit(): void {
    if (this.dynamicDialogConfig.data.id) {
      const id = this.dynamicDialogConfig.data.id;
      this.suppliersService.getOne(id).subscribe((response: Supplier) => {
        this.form.patchValue(response);
      });
    }
  }

  saveSupplierButton() {
    if (this.form) {
      const role = new Supplier(this.form.value);
      if (this.dynamicDialogConfig.data.id) {
        const id = this.dynamicDialogConfig.data.id;
        this.suppliersService.edit(id, role).subscribe({
          next: () => this.dialogRef.close({ success: true }),
          error: () => this.dialogRef.close({ error: true }),
        });
      } else {
        this.suppliersService.create(role).subscribe({
          next: () => this.dialogRef.close({ success: true }),
          error: () => this.dialogRef.close({ error: true }),
        });
      }
    }
  }

  get isValidForm(): boolean {
    return this.form.invalid;
  }
}
