import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../../../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import {
  CallToAction,
  Column,
} from '../../../../../interfaces/table.interface';
import { Order } from '../../models/orders.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingService } from '../../../../../services/loading.service';
import { PaginatorState } from 'primeng/paginator';
import { debounceTime, Observable } from 'rxjs';
import { showError, showSuccess } from '../../../../../utils/notifications';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
    RouterModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersListComponent implements OnInit {
  columns: Column[] = [
    {
      header: '#',
      field: 'id',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Proveedor',
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
      header: 'Fecha de emisión',
      field: 'date',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Estado',
      field: 'status',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Total',
      field: 'total',
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
  callToAction: CallToAction<Order>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Order) => this.editOrderButton(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Order, event?: Event) =>
        this.deleteOrderButton(rowData.id, event!),
    },
  ];

  formGroup: FormGroup = new FormGroup({
    search: new FormControl(),
  });

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly loadingService: LoadingService,
    private readonly ordersService: OrdersService,
    private readonly router: Router,
  ) {}

  clearSearchFilter() {
    this.formGroup.get('search')?.setValue('');
  }

  ngOnInit(): void {
    this.getOrders(this.limit, this.page, this.search);
    this.formGroup
      .get('search')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe((value: any) => {
        this.search = value ? value : '';
        this.getOrders(this.limit, this.page, this.search);
      });
  }

  async getOrders(
    limit = this.limit,
    page = this.page,
    search = this.search,
  ): Promise<void> {
    this.updatePage(page);
    this.ordersService.callGetList(limit, page, search).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);
  }

  async onPageSelected(paginate: PaginatorState): Promise<void> {
    this.updatePage((paginate.page ?? 0) + 1);
    this.getOrders(paginate.rows, this.page);
  }

  get orders(): Observable<Order[]> {
    return this.ordersService.getList();
  }

  get total(): Observable<number> {
    return this.ordersService.getTotal();
  }

  addOrderButton() {
    this.router.navigate(['/operations/orders/create']);
  }

  editOrderButton(id: number) {
    this.router.navigate([`/operations/orders/edit/${id}`]);
  }

  deleteOrderButton(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas anular esta compra?',
      header: 'Anular compra',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.ordersService.delete(id).subscribe({
          next: () => {
            showSuccess(this.messageService, 'La compra ha sido cancelada');
            this.getOrders(this.limit, this.page, this.search);
          },
          error: () =>
            showError(
              this.messageService,
              'No se eleminó la compra, intenteló nuevamente',
            ),
        });
      },
      reject: () => {},
    });
  }

  private updatePage(value: number): void {
    this.page = value;
  }
}
