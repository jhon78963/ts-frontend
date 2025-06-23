import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrandsService } from '../../services/brands.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Brand } from '../../models/brands.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-brands-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './brands-form.component.html',
  styleUrl: './brands-form.component.scss',
})
export class BrandsFormComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly brandsService: BrandsService,
    private readonly dialogRef: DynamicDialogRef,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ) {}
  form: FormGroup = this.formBuilder.group({
    description: ['', Validators.required],
  });
  ngOnInit(): void {
    if (this.dynamicDialogConfig.data.id) {
      const id = this.dynamicDialogConfig.data.id;
      this.brandsService.getOne(id).subscribe((response: Brand) => {
        this.form.patchValue(response);
      });
    }
  }

  saveBrandButton() {
    if (this.form) {
      const role = new Brand(this.form.value);
      if (this.dynamicDialogConfig.data.id) {
        const id = this.dynamicDialogConfig.data.id;
        this.brandsService.edit(id, role).subscribe({
          next: () => this.dialogRef.close({ success: true }),
          error: () => this.dialogRef.close({ error: true }),
        });
      } else {
        this.brandsService.create(role).subscribe({
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
