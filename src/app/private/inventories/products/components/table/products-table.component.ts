import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from '../../../../../shared/shared.module';
import { Product } from '../../models/products.mode';
import { AutocompleteResponse } from '../../../../../shared/models/autocomplete.interface';
import { SaleProductService } from '../../../../operations/sales/services/saleProducts.service';
import { showError, showSuccess } from '../../../../../utils/notifications';
import { ProgressSpinnerService } from '../../../../../services/progress-spinner.service';
import { OrderProductService } from '../../../../operations/orders/services/orderProducts.service';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    InputTextModule,
    ConfirmDialogModule,
  ],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss',
  providers: [ConfirmationService],
})
export class ProductsTableComponent implements OnInit, OnChanges {
  @Input() operationId: number = 0;
  @Input() addProductEvent = new EventEmitter<void>();
  @Input() products: Product[] = [];
  @Input() parentForm!: FormGroup;
  @Input() enableCollectionToSave = true;
  @Input() operation: string | null = null;
  productSelected = output<any>();
  mainForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly saleProductService: SaleProductService,
    private readonly orderProductService: OrderProductService,
    private readonly messageService: MessageService,
    private readonly progressSpinnerService: ProgressSpinnerService,
  ) {
    this.mainForm = this.formBuilder.group({
      products: this.formBuilder.array([this.createRow()]),
    });
  }

  ngOnInit(): void {
    this.addProductEvent.subscribe(() => {
      this.addRow();
    });
    this.parentForm.setControl('products', this.productsArray);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']?.currentValue) {
      const newProducts = changes['products'].currentValue;
      this.productsArray.clear();
      newProducts.forEach((product: any) => {
        const row = this.createRow();
        row.patchValue(product);
        this.productsArray.push(row);
      });
      if (this.products.length == 0) {
        this.addRow();
      }
    }
  }

  updateParent() {
    const productsValue = this.productsArray.value;
    this.parentForm.get('products')?.setValue(productsValue);
  }

  get productsArray(): FormArray {
    return this.mainForm.get('products') as FormArray;
  }

  createRow(): FormGroup {
    return this.formBuilder.group({
      product: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  addRow() {
    this.productsArray.push(this.createRow());
  }

  removeItem(productId: number, index: number, event: any) {
    if (productId) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Deseas eliminar este producto?',
        header: 'Eliminar producto',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-text',
        rejectButtonStyleClass: 'p-button-text p-button-text',
        acceptIcon: 'none',
        rejectIcon: 'none',
        accept: () => {
          this.progressSpinnerService.show();
          if (this.operation == 'sales') {
            this.saleProductService
              .remove(this.operationId, productId)
              .subscribe({
                next: () => {
                  showSuccess(
                    this.messageService,
                    'El producto ha sido eliminado',
                  );
                  this.productsArray.removeAt(index);
                  this.progressSpinnerService.hidden();
                },
                error: () => {
                  showError(
                    this.messageService,
                    'No se eleminó el producto, intenteló nuevamente',
                  );
                  this.productsArray.removeAt(index);
                  this.progressSpinnerService.hidden();
                },
              });
          } else {
            this.orderProductService
              .remove(this.operationId, productId)
              .subscribe({
                next: () => {
                  showSuccess(
                    this.messageService,
                    'El producto ha sido eliminado',
                  );
                  this.productsArray.removeAt(index);
                  this.progressSpinnerService.hidden();
                },
                error: () => {
                  showError(
                    this.messageService,
                    'No se eleminó el producto, intenteló nuevamente',
                  );
                  this.productsArray.removeAt(index);
                  this.progressSpinnerService.hidden();
                },
              });
          }
        },
        reject: () => {},
      });
    } else {
      this.productsArray.removeAt(index);
    }
  }

  // productButton(productId: number = 0, type: string = '', index: number = 0) {
  //   if (type == 'create') {
  //     this.productSelected.emit({
  //       productId: this.productsArray.at(index).value,
  //       type,
  //     });
  //   } else {
  //     this.productSelected.emit({ productId, type });
  //   }
  // }

  // sendProduct(type: string) {
  //   this.productSelected.emit({ type });
  // }

  setFormField(
    field: 'product',
    value: AutocompleteResponse | null,
    index: number,
  ) {
    this.productsArray.at(index)?.get(field)?.setValue(value);
  }
}
