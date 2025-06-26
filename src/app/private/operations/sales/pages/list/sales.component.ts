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
import { Sale } from '../../models/sales.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingService } from '../../../../../services/loading.service';
import { PaginatorState } from 'primeng/paginator';
import { debounceTime, Observable } from 'rxjs';
import { showError, showSuccess } from '../../../../../utils/notifications';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
    RouterModule,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesListComponent implements OnInit {
  columns: Column[] = [
    {
      header: '#',
      field: 'id',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Cliente',
      field: 'customer',
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
      header: 'Total',
      field: 'total',
      clickable: false,
      image: false,
      money: true,
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
  callToAction: CallToAction<Sale>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Sale) => this.editSaleButton(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Sale, event?: Event) =>
        this.deleteSaleButton(rowData.id, event!),
    },
  ];

  formGroup: FormGroup = new FormGroup({
    search: new FormControl(),
  });

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly loadingService: LoadingService,
    private readonly salesService: SalesService,
    private readonly router: Router,
  ) {}

  clearSearchFilter() {
    this.formGroup.get('search')?.setValue('');
  }

  ngOnInit(): void {
    this.getSales(this.limit, this.page, this.search);
    this.formGroup
      .get('search')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe((value: any) => {
        this.search = value ? value : '';
        this.getSales(this.limit, this.page, this.search);
      });
  }

  async getSales(
    limit = this.limit,
    page = this.page,
    search = this.search,
  ): Promise<void> {
    this.updatePage(page);
    this.salesService.callGetList(limit, page, search).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);
  }

  async onPageSelected(paginate: PaginatorState): Promise<void> {
    this.updatePage((paginate.page ?? 0) + 1);
    this.getSales(paginate.rows, this.page);
  }

  get sales(): Observable<Sale[]> {
    return this.salesService.getList();
  }

  get total(): Observable<number> {
    return this.salesService.getTotal();
  }

  addSaleButton() {
    this.router.navigate(['/operations/sales/create']);
  }

  editSaleButton(id: number) {
    this.router.navigate([`/operations/sales/edit/${id}`]);
  }

  deleteSaleButton(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas anular esta venta?',
      header: 'Anular compra',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.salesService.delete(id).subscribe({
          next: () => {
            showSuccess(this.messageService, 'La venta ha sido anulada');
            this.getSales(this.limit, this.page, this.search);
          },
          error: () =>
            showError(
              this.messageService,
              'No se eleminó la venta, intenteló nuevamente',
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
