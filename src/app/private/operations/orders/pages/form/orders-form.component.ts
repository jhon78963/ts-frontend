import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { ProgressSpinnerService } from '../../../../../services/progress-spinner.service';
import { Order, OrderResponse } from '../../models/orders.model';
import { AutocompleteResponse } from '../../../../../shared/models/autocomplete.interface';
import { formatDateTime } from '../../../../../utils/dates';
import { Product } from '../../../../inventories/products/models/products.mode';
import { ProductsTableComponent } from '../../../../inventories/products/components/table/products-table.component';
import { OrderProductService } from '../../services/orderProducts.service';
import { forkJoin } from 'rxjs';
import { showSuccess } from '../../../../../utils/notifications';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    KeyFilterModule,
    RouterModule,
    ProductsTableComponent,
    ToastModule,
  ],
  templateUrl: './orders-form.component.html',
  styleUrl: './orders-form.component.scss',
})
export class OrdersFormComponent implements OnInit {
  @Output() addProductEvent = new EventEmitter<void>();
  orderId: number = 0;
  supplierId: number = 0;
  products: Product[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ordersService: OrdersService,
    private readonly orderProductService: OrderProductService,
    private readonly progressSpinnerService: ProgressSpinnerService,
    private readonly route: ActivatedRoute,
    private readonly datePipe: DatePipe,
    private readonly messageService: MessageService,
  ) {
    if (this.route.snapshot.paramMap.get('id')) {
      this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    }
  }

  form: FormGroup = this.formBuilder.group({
    date: ['', Validators.required],
    status: ['PENDING', Validators.nullValidator],
    supplierId: ['', Validators.required],
    products: this.formBuilder.array([]),
  });

  setFormField(field: 'supplierId', value: AutocompleteResponse | null): void {
    this.form.get(field)?.setValue(value?.id ?? '');
  }

  formatProductSizes() {
    return (this.form.get('products')?.value || []).filter((item: any) => {
      return !(
        item.product === '' &&
        item.quantity === '' &&
        item.price === ''
      );
    });
  }

  ngOnInit(): void {
    if (this.orderId) {
      this.ordersService.getOne(this.orderId).subscribe((response: Order) => {
        response.date = new Date(response.date);
        this.form.patchValue(response);
        this.products = response.products;
        this.supplierId = response.supplierId;
      });
    }
  }

  saveOrderButton() {
    const rawForm = this.form.getRawValue();
    const formattedPayload = {
      ...rawForm,
      date: formatDateTime(rawForm.date, this.datePipe),
    };
    this.progressSpinnerService.show();
    if (this.orderId) {
      this.ordersService.edit(this.orderId, formattedPayload).subscribe({
        next: () => {
          if (formattedPayload.products.length > 0) {
            const updateCalls = formattedPayload.products.map(
              (product: any) => {
                return this.orderProductService.update(
                  this.orderId,
                  product.product.id,
                  {
                    quantity: product.quantity,
                    price: product.price,
                  },
                );
              },
            );
            forkJoin(updateCalls).subscribe({
              next: () => {
                this.form.reset();
                this.progressSpinnerService.hidden();
                showSuccess(
                  this.messageService,
                  'Orden de Compra actualizada con exito!',
                );
              },
              error: () => {
                this.progressSpinnerService.hidden();
              },
            });
          } else {
            this.progressSpinnerService.hidden();
          }
        },
        error: () => {
          this.progressSpinnerService.hidden();
        },
      });
    } else {
      this.ordersService.create(formattedPayload).subscribe({
        next: (response: OrderResponse) => {
          if (formattedPayload.products.length > 0) {
            const createCalls = formattedPayload.products.map(
              (product: any) => {
                return this.orderProductService.add(
                  response.orderId,
                  product.product.id,
                  {
                    quantity: product.quantity,
                    price: product.price,
                  },
                );
              },
            );
            forkJoin(createCalls).subscribe({
              next: () => {
                this.form.reset();
                this.supplierId = undefined!;
                const productsFormArray = this.form.get('products') as any;
                if (productsFormArray && productsFormArray.clear) {
                  productsFormArray.clear();
                }
                setTimeout(() => {
                  this.supplierId = 0;
                  this.addProduct();
                }, 0);
                this.progressSpinnerService.hidden();
                showSuccess(
                  this.messageService,
                  'Orden de Compra registrada con exito!',
                );
              },
              error: () => {
                this.progressSpinnerService.hidden();
              },
            });
          } else {
            this.progressSpinnerService.hidden();
          }
        },
        error: () => {
          this.progressSpinnerService.hidden();
        },
      });
    }
  }

  addProduct() {
    this.addProductEvent.emit();
  }

  getProductSeletected(form: any) {
    console.log(form);
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }
}
