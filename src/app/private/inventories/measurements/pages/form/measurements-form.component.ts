import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MeasurementsService } from '../../services/measurements.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Measurement } from '../../models/measurements.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-measurements-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './measurements-form.component.html',
  styleUrl: './measurements-form.component.scss',
})
export class MeasurementsFormComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly measurementsService: MeasurementsService,
    private readonly dialogRef: DynamicDialogRef,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ) {}
  form: FormGroup = this.formBuilder.group({
    description: ['', Validators.required],
  });
  ngOnInit(): void {
    if (this.dynamicDialogConfig.data.id) {
      const id = this.dynamicDialogConfig.data.id;
      this.measurementsService.getOne(id).subscribe((response: Measurement) => {
        this.form.patchValue(response);
      });
    }
  }

  saveMeasurementButton() {
    if (this.form) {
      const role = new Measurement(this.form.value);
      if (this.dynamicDialogConfig.data.id) {
        const id = this.dynamicDialogConfig.data.id;
        this.measurementsService.edit(id, role).subscribe({
          next: () => this.dialogRef.close({ success: true }),
          error: () => this.dialogRef.close({ error: true }),
        });
      } else {
        this.measurementsService.create(role).subscribe({
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
