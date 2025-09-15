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
import { SalesService } from '../../services/sales.service';
import { ProgressSpinnerService } from '../../../../../services/progress-spinner.service';
import { Sale, SaleResponse } from '../../models/sales.model';
import { AutocompleteResponse } from '../../../../../shared/models/autocomplete.interface';
import { formatDateTime } from '../../../../../utils/dates';
import { Product } from '../../../../inventories/products/models/products.model';
import { SaleProductService } from '../../services/saleProducts.service';
import { forkJoin } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { showSuccess } from '../../../../../utils/notifications';
import { ProductsTableComponent } from '../../../../inventories/products/components/table/products-table.component';

@Component({
  selector: 'app-sales-form',
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
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss',
})
export class SalesFormComponent implements OnInit {
  @Output() addProductEvent = new EventEmitter<void>();
  saleId: number = 0;
  customerId: number = 0;
  products: Product[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly salesService: SalesService,
    private readonly saleProductService: SaleProductService,
    private readonly progressSpinnerService: ProgressSpinnerService,
    private readonly route: ActivatedRoute,
    private readonly datePipe: DatePipe,
    private readonly messageService: MessageService,
  ) {
    if (this.route.snapshot.paramMap.get('id')) {
      this.saleId = Number(this.route.snapshot.paramMap.get('id'));
    }
  }

  form: FormGroup = this.formBuilder.group({
    date: [new Date(), Validators.required],
    customerId: ['', Validators.required],
    products: this.formBuilder.array([]),
  });

  setFormField(field: 'customerId', value: AutocompleteResponse | null): void {
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
    if (this.saleId) {
      this.salesService.getOne(this.saleId).subscribe((response: Sale) => {
        response.date = new Date(response.date);
        this.form.patchValue(response);
        this.products = response.products;
        this.customerId = response.customerId;
      });
    }
  }

  saveSaleButton() {
    const rawForm = this.form.getRawValue();
    const formattedPayload = {
      ...rawForm,
      date: formatDateTime(rawForm.date, this.datePipe),
    };
    this.progressSpinnerService.show();
    if (this.saleId) {
      this.salesService.edit(this.saleId, formattedPayload).subscribe({
        next: () => {
          if (formattedPayload.products.length > 0) {
            const updateCalls = formattedPayload.products.map(
              (product: any) => {
                return this.saleProductService.update(
                  this.saleId,
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
                  'Venta actualizada con exito!',
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
      this.salesService.create(formattedPayload).subscribe({
        next: (response: SaleResponse) => {
          if (formattedPayload.products.length > 0) {
            const createCalls = formattedPayload.products.map(
              (product: any) => {
                return this.saleProductService.add(
                  response.saleId,
                  product.product.id,
                  {
                    quantity: Number(product.quantity),
                    price: Number(product.price),
                  },
                );
              },
            );
            forkJoin(createCalls).subscribe({
              next: () => {
                this.form.reset();
                this.customerId = undefined!;
                const productsFormArray = this.form.get('products') as any;
                if (productsFormArray && productsFormArray.clear) {
                  productsFormArray.clear();
                }
                setTimeout(() => {
                  this.customerId = 0;
                  this.addProduct();
                }, 0);
                this.progressSpinnerService.hidden();
                showSuccess(this.messageService, 'Venta registrada con exito!');
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

  get isFormValid(): boolean {
    return this.form.valid;
  }
}
