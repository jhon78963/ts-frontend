import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomersService } from '../../services/customers.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Customer } from '../../models/customers.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, KeyFilterModule],
  templateUrl: './Customers-form.component.html',
  styleUrl: './Customers-form.component.scss',
})
export class CustomersFormComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly customersService: CustomersService,
    private readonly dialogRef: DynamicDialogRef,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ) {}
  form: FormGroup = this.formBuilder.group({
    dni: ['', Validators.required],
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phone: ['', Validators.required],
  });
  ngOnInit(): void {
    if (this.dynamicDialogConfig.data.id) {
      const id = this.dynamicDialogConfig.data.id;
      this.customersService.getOne(id).subscribe((response: Customer) => {
        this.form.patchValue(response);
      });
    }
  }

  saveCustomerButton() {
    if (this.form) {
      const role = new Customer(this.form.value);
      if (this.dynamicDialogConfig.data.id) {
        const id = this.dynamicDialogConfig.data.id;
        this.customersService.edit(id, role).subscribe({
          next: () => this.dialogRef.close({ success: true }),
          error: () => this.dialogRef.close({ error: true }),
        });
      } else {
        this.customersService.create(role).subscribe({
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
