import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Category } from '../../models/categories.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.scss',
})
export class CategoriesFormComponent implements OnInit {
  errorMessage: string = '';
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoriesService: CategoriesService,
    private readonly dialogRef: DynamicDialogRef,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ) {}
  form: FormGroup = this.formBuilder.group({
    description: ['', Validators.required],
  });
  ngOnInit(): void {
    if (this.dynamicDialogConfig.data.id) {
      const id = this.dynamicDialogConfig.data.id;
      this.categoriesService.getOne(id).subscribe((response: Category) => {
        this.form.patchValue(response);
      });
    }
  }

  saveCategoryButton() {
    if (this.form) {
      const role = new Category(this.form.value);
      if (this.dynamicDialogConfig.data.id) {
        const id = this.dynamicDialogConfig.data.id;
        this.categoriesService.edit(id, role).subscribe({
          next: (resp: any) => {
            console.log(resp);
            // this.dialogRef.close({ success: true });
          },
          error: (err: any) => {
            console.log(err.error.message);
            this.errorMessage = err.error.message;
            // this.dialogRef.close({ error: true });
          },
        });
      } else {
        this.categoriesService.create(role).subscribe({
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
