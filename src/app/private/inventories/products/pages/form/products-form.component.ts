import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { ProductsService } from '../../services/products.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { AutocompleteResponse } from '../../../../../shared/models/autocomplete.interface';
import { FileUploadModule } from 'primeng/fileupload';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProgressSpinnerService } from '../../../../../services/progress-spinner.service';
import { FileService } from '../../../../../services/file.service';
import { Product } from '../../models/products.mode';
import { BASE_S3_URL } from '../../../../../utils/constants';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    KeyFilterModule,
    FileUploadModule,
    RouterModule,
  ],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
})
export class ProductsFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  imagePreview: string | null = null;
  productId: number = 0;
  categoryId: number = 0;
  brandId: number = 0;
  measurementId: number = 0;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productsService: ProductsService,
    private readonly fileService: FileService,
    private readonly progressSpinnerService: ProgressSpinnerService,
    private readonly route: ActivatedRoute,
  ) {
    if (this.route.snapshot.paramMap.get('id')) {
      this.productId = Number(this.route.snapshot.paramMap.get('id'));
    }
  }

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    salePrice: ['', Validators.required],
    purchasePrice: ['', Validators.required],
    stock: ['', Validators.required],
    image: [null, Validators.nullValidator],
    status: ['AVAILABLE', Validators.nullValidator],
    categoryId: ['', Validators.required],
    brandId: ['', Validators.required],
    measurementId: ['', Validators.required],
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.form.get('image')?.setValue(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  setFormField(
    field: 'categoryId' | 'brandId' | 'measurementId',
    value: AutocompleteResponse | null,
  ): void {
    this.form.get(field)?.setValue(value?.id ?? '');
  }

  ngOnInit(): void {
    if (this.productId) {
      this.productsService
        .getOne(this.productId)
        .subscribe((response: Product) => {
          this.form.patchValue(response);
          this.categoryId = response.categoryId;
          this.brandId = response.brandId;
          this.measurementId = response.measurementId;
          this.imagePreview = `${BASE_S3_URL}${response.image}`;
        });
    }
  }

  saveProductButton() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const imageFile =
      this.form.value.image instanceof File ? this.form.value.image : null;
    const product = new Product(this.form.value);

    const proceedToSave = (imagePath?: string) => {
      if (imagePath) product.image = imagePath;

      const saveObservable = this.productId
        ? this.productsService.edit(this.productId, product)
        : this.productsService.create(product);

      this.progressSpinnerService.show();
      saveObservable.subscribe({
        next: () => {
          this.progressSpinnerService.hidden();
          if (!this.productId) {
            this.form.reset();
            this.imagePreview = null;
            this.fileInput.nativeElement.value = '';
            this.categoryId = undefined!;
            this.brandId = undefined!;
            this.measurementId = undefined!;
            setTimeout(() => {
              this.categoryId = 0;
              this.brandId = 0;
              this.measurementId = 0;
            }, 0);
          }
        },
        error: () => {
          this.progressSpinnerService.hidden();
        },
      });
    };

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      this.progressSpinnerService.show();
      this.fileService.createImage(formData, false).subscribe({
        next: (resp: any) => {
          if (resp?.image) {
            proceedToSave(resp.image);
          } else {
            proceedToSave(); // No image path returned
          }
        },
        error: () => {
          this.progressSpinnerService.hidden();
          console.error('Error al subir imagen');
        },
      });
    } else {
      proceedToSave(); // No image to upload
    }
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }
}
