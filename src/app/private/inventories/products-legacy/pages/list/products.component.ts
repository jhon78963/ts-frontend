import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  CallToAction,
  Column,
} from '../../../../../interfaces/table.interface';
import { Product } from '../../models/products.model';
import { DialogService } from 'primeng/dynamicdialog';
import { LoadingService } from '../../../../../services/loading.service';
import { ProductsService } from '../../services/products.service';
import { PaginatorState } from 'primeng/paginator';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { showError, showSuccess } from '../../../../../utils/notifications';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
    RouterModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [ConfirmationService, DialogService, MessageService],
})
export class ProductListComponent implements OnInit {
  columns: Column[] = [
    {
      header: '#',
      field: 'id',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Descripción',
      field: 'description',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Stock',
      field: 'stock',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Precio de Venta',
      field: 'salePrice',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Precio de Compra',
      field: 'purchasePrice',
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
  callToAction: CallToAction<Product>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Product) => this.editProductButton(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Product, event?: Event) =>
        this.deleteProductButton(rowData.id, event!),
    },
  ];

  constructor(
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly loadingService: LoadingService,
    private readonly productsService: ProductsService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.getProducts(this.limit, this.page, this.search);
  }

  async getProducts(
    limit = this.limit,
    page = this.page,
    search = this.search,
  ): Promise<void> {
    this.updatePage(page);
    this.productsService.callGetList(limit, page, search).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);
  }

  async onPageSelected(paginate: PaginatorState): Promise<void> {
    this.updatePage((paginate.page ?? 0) + 1);
    this.getProducts(paginate.rows, this.page);
  }

  get products(): Observable<Product[]> {
    return this.productsService.getList();
  }

  get total(): Observable<number> {
    return this.productsService.getTotal();
  }

  addProductButton() {
    this.router.navigate(['/inventories/products/create/general']);
  }

  editProductButton(id: number) {
    this.router.navigate([`/inventories/products/step/general/${id}`]);
  }

  ecommerceProductButton(id: number) {
    this.router.navigate([`/inventories/products/ecommerce/${id}`]);
  }

  deleteProductButton(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas eliminar este usuario?',
      header: 'Eliminar usuario',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.productsService.delete(id).subscribe({
          next: () =>
            showSuccess(this.messageService, 'El producto ha sido eliminado'),
          error: () =>
            showError(
              this.messageService,
              'No se eleminó el producto, intenteló nuevamente',
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
