import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  CallToAction,
  Column,
} from '../../../../../interfaces/table.interface';
import { Customer } from '../../models/customers.model';
import { LoadingService } from '../../../../../services/loading.service';
import { CustomersService } from '../../services/customers.service';
import { debounceTime, Observable } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomersFormComponent } from '../form/customers-form.component';
import { showError, showSuccess } from '../../../../../utils/notifications';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersListComponent implements OnInit {
  columns: Column[] = [
    {
      header: '#',
      field: 'id',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'DNI',
      field: 'dni',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Nombre(s) y apellido(s)',
      field: 'fullName',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Celular',
      field: 'phone',
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
  callToAction: CallToAction<Customer>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Customer) => this.editCustomerButton(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Customer, event?: Event) =>
        this.deleteCustomerButton(rowData.id, event!),
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
    private readonly customersService: CustomersService,
  ) {}

  clearSearchFilter() {
    this.formGroup.get('search')?.setValue('');
  }

  ngOnInit(): void {
    this.getCustomers(this.limit, this.page, this.search);
    this.formGroup
      .get('search')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe((value: any) => {
        this.search = value ? value : '';
        this.getCustomers(this.limit, this.page, this.search);
      });
  }

  async getCustomers(
    limit = this.limit,
    page = this.page,
    search = this.search,
  ): Promise<void> {
    this.updatePage(page);
    this.customersService.callGetList(limit, page, search).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);
  }

  private updatePage(value: number): void {
    this.page = value;
  }

  async onPageSelected(paginate: PaginatorState): Promise<void> {
    this.updatePage((paginate.page ?? 0) + 1);
    this.getCustomers(paginate.rows, this.page);
  }

  get customers(): Observable<Customer[]> {
    return this.customersService.getList();
  }

  get total(): Observable<number> {
    return this.customersService.getTotal();
  }

  addCustomerButton() {
    const modal = this.dialogService.open(CustomersFormComponent, {
      data: {},
      header: 'Crear',
    });

    modal.onClose.subscribe({
      next: value => {
        if (value?.success) {
          showSuccess(this.messageService, 'Cliente creado.');
          this.getCustomers(this.limit, this.page, this.search);
        } else if (value?.error) {
          showError(this.messageService, value.error);
          this.getCustomers(this.limit, this.page, this.search);
        }
      },
    });
  }

  editCustomerButton(id: number) {
    const modal = this.dialogService.open(CustomersFormComponent, {
      data: {
        id,
      },
      header: 'Editar',
    });

    modal.onClose.subscribe({
      next: value => {
        if (value?.success) {
          showSuccess(this.messageService, 'Cliente actualizado.');
          this.getCustomers(this.limit, this.page, this.search);
        } else if (value?.error) {
          showError(this.messageService, value.error);
          this.getCustomers(this.limit, this.page, this.search);
        }
      },
    });
  }

  deleteCustomerButton(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas eliminar este cliente?',
      header: 'Eliminar cliente',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.customersService.delete(id).subscribe({
          next: () => {
            showSuccess(this.messageService, 'El cliente ha sido eliminado');
            this.getCustomers(this.limit, this.page, this.search);
          },
          error: () => {
            showError(
              this.messageService,
              'No se eleminó el cliente, intenteló nuevamente',
            );
            this.getCustomers(this.limit, this.page, this.search);
          },
        });
      },
      reject: () => {},
    });
  }
}
