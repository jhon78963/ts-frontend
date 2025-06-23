import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  CallToAction,
  Column,
} from '../../../../../interfaces/table.interface';
import { Measurement } from '../../models/measurements.model';
import { LoadingService } from '../../../../../services/loading.service';
import { MeasurementsService } from '../../services/measurements.service';
import { debounceTime, Observable } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { DialogService } from 'primeng/dynamicdialog';
import { MeasurementsFormComponent } from '../form/measurements-form.component';
import { showError, showSuccess } from '../../../../../utils/notifications';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
  ],
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.scss',
})
export class MeasurementsListComponent implements OnInit {
  columns: Column[] = [
    {
      header: '#',
      field: 'id',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Unidad de medida',
      field: 'description',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Acción',
      field: 'button',
      clickable: false,
      image: false,
      money: false,
    },
  ];
  cellToAction: any;
  limit: number = 10;
  page: number = 1;
  search: string = '';
  callToAction: CallToAction<Measurement>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Measurement) => this.editMeasurementButton(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Measurement, event?: Event) =>
        this.deleteMeasurementButton(rowData.id, event!),
    },
  ];

  formGroup: FormGroup = new FormGroup({
    search: new FormControl(),
  });

  constructor(
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly loadingService: LoadingService,
    private readonly measurementsService: MeasurementsService,
  ) {}

  clearSearchFilter() {
    this.formGroup.get('search')?.setValue('');
  }

  ngOnInit(): void {
    this.getMeasurements(this.limit, this.page, this.search);
    this.formGroup
      .get('search')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe((value: any) => {
        this.search = value ? value : '';
        this.getMeasurements(this.limit, this.page, this.search);
      });
  }

  async getMeasurements(
    limit = this.limit,
    page = this.page,
    search = this.search,
  ): Promise<void> {
    this.updatePage(page);
    this.measurementsService.callGetList(limit, page, search).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);
  }

  private updatePage(value: number): void {
    this.page = value;
  }

  async onPageSelected(paginate: PaginatorState): Promise<void> {
    this.updatePage((paginate.page ?? 0) + 1);
    this.getMeasurements(paginate.rows, this.page);
  }

  get measurements(): Observable<Measurement[]> {
    return this.measurementsService.getList();
  }

  get total(): Observable<number> {
    return this.measurementsService.getTotal();
  }

  addMeasurementButton() {
    const modal = this.dialogService.open(MeasurementsFormComponent, {
      data: {},
      header: 'Crear',
    });

    modal.onClose.subscribe({
      next: value => {
        if (value?.success) {
          showSuccess(this.messageService, 'Unidad de medida creada.');
          this.getMeasurements(this.limit, this.page, this.search);
        } else if (value?.error) {
          showError(this.messageService, value.error);
          this.getMeasurements(this.limit, this.page, this.search);
        }
      },
    });
  }

  editMeasurementButton(id: number) {
    const modal = this.dialogService.open(MeasurementsFormComponent, {
      data: {
        id,
      },
      header: 'Editar',
    });

    modal.onClose.subscribe({
      next: value => {
        if (value?.success) {
          showSuccess(this.messageService, 'Unidad de medida actualizada.');
          this.getMeasurements(this.limit, this.page, this.search);
        } else if (value?.error) {
          showError(this.messageService, value.error);
          this.getMeasurements(this.limit, this.page, this.search);
        }
      },
    });
  }

  deleteMeasurementButton(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas eliminar esta unidad de medida?',
      header: 'Eliminar unidad de medida',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.measurementsService.delete(id).subscribe({
          next: () => {
            showSuccess(
              this.messageService,
              'La unidad de medida ha sido eliminado',
            );
            this.getMeasurements(this.limit, this.page, this.search);
          },
          error: () => {
            showError(
              this.messageService,
              'No se eleminó la unidad de medida, intenteló nuevamente',
            );
            this.getMeasurements(this.limit, this.page, this.search);
          },
        });
      },
      reject: () => {},
    });
  }
}
