import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  CallToAction,
  Column,
} from '../../../../../interfaces/table.interface';
import { Supplier } from '../../models/suppliers.model';
import { LoadingService } from '../../../../../services/loading.service';
import { SuppliersService } from '../../services/suppliers.service';
import { debounceTime, Observable } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { DialogService } from 'primeng/dynamicdialog';
import { SuppliersFormComponent } from '../form/suppliers-form.component';
import { showError, showSuccess } from '../../../../../utils/notifications';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersListComponent implements OnInit {
  columns: Column[] = [
    {
      header: '#',
      field: 'id',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'RUC',
      field: 'ruc',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Razón Social',
      field: 'businessName',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Encargado',
      field: 'manager',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Dirección',
      field: 'address',
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
  callToAction: CallToAction<Supplier>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Supplier) => this.editSupplierButton(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Supplier, event?: Event) =>
        this.deleteSupplierButton(rowData.id, event!),
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
    private readonly suppliersService: SuppliersService,
  ) {}

  clearSearchFilter() {
    this.formGroup.get('search')?.setValue('');
  }

  ngOnInit(): void {
    this.getSuppliers(this.limit, this.page, this.search);
    this.formGroup
      .get('search')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe((value: any) => {
        this.search = value ? value : '';
        this.getSuppliers(this.limit, this.page, this.search);
      });
  }

  async getSuppliers(
    limit = this.limit,
    page = this.page,
    search = this.search,
  ): Promise<void> {
    this.updatePage(page);
    this.suppliersService.callGetList(limit, page, search).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);
  }

  private updatePage(value: number): void {
    this.page = value;
  }

  async onPageSelected(paginate: PaginatorState): Promise<void> {
    this.updatePage((paginate.page ?? 0) + 1);
    this.getSuppliers(paginate.rows, this.page);
  }

  get suppliers(): Observable<Supplier[]> {
    return this.suppliersService.getList();
  }

  get total(): Observable<number> {
    return this.suppliersService.getTotal();
  }

  addSupplierButton() {
    const modal = this.dialogService.open(SuppliersFormComponent, {
      data: {},
      header: 'Crear',
    });

    modal.onClose.subscribe({
      next: value => {
        if (value?.success) {
          showSuccess(this.messageService, 'Proveedor creado.');
          this.getSuppliers(this.limit, this.page, this.search);
        } else if (value?.error) {
          showError(this.messageService, value.error);
          this.getSuppliers(this.limit, this.page, this.search);
        }
      },
    });
  }

  editSupplierButton(id: number) {
    const modal = this.dialogService.open(SuppliersFormComponent, {
      data: {
        id,
      },
      header: 'Editar',
    });

    modal.onClose.subscribe({
      next: value => {
        if (value?.success) {
          showSuccess(this.messageService, 'Proveedor actualizado.');
          this.getSuppliers(this.limit, this.page, this.search);
        } else if (value?.error) {
          showError(this.messageService, value.error);
          this.getSuppliers(this.limit, this.page, this.search);
        }
      },
    });
  }

  deleteSupplierButton(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas eliminar este proveedor?',
      header: 'Eliminar proveedor',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.suppliersService.delete(id).subscribe({
          next: () => {
            showSuccess(this.messageService, 'El proveedor ha sido eliminado');
            this.getSuppliers(this.limit, this.page, this.search);
          },
          error: () => {
            showError(
              this.messageService,
              'No se eleminó el proveedor, intenteló nuevamente',
            );
            this.getSuppliers(this.limit, this.page, this.search);
          },
        });
      },
      reject: () => {},
    });
  }
}
