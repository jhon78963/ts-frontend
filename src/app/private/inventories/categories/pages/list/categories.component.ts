import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  CallToAction,
  Column,
} from '../../../../../interfaces/table.interface';
import { Category } from '../../models/categories.model';
import { LoadingService } from '../../../../../services/loading.service';
import { CategoriesService } from '../../services/categories.service';
import { debounceTime, Observable } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoriesFormComponent } from '../form/categories-form.component';
import { showError, showSuccess } from '../../../../../utils/notifications';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesListComponent implements OnInit {
  columns: Column[] = [
    {
      header: '#',
      field: 'id',
      clickable: false,
      image: false,
      money: false,
    },
    {
      header: 'Categoría',
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
  callToAction: CallToAction<Category>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Category) => this.editCategoryButton(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Category, event?: Event) =>
        this.deleteCategoryButton(rowData.id, event!),
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
    private readonly categoriesService: CategoriesService,
  ) {}

  clearSearchFilter() {
    this.formGroup.get('search')?.setValue('');
  }

  ngOnInit(): void {
    this.getCategories(this.limit, this.page, this.search);
    this.formGroup
      .get('search')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe((value: any) => {
        this.search = value ? value : '';
        this.getCategories(this.limit, this.page, this.search);
      });
  }

  async getCategories(
    limit = this.limit,
    page = this.page,
    search = this.search,
  ): Promise<void> {
    this.updatePage(page);
    this.categoriesService.callGetList(limit, page, search).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);
  }

  private updatePage(value: number): void {
    this.page = value;
  }

  async onPageSelected(paginate: PaginatorState): Promise<void> {
    this.updatePage((paginate.page ?? 0) + 1);
    this.getCategories(paginate.rows, this.page);
  }

  get categories(): Observable<Category[]> {
    return this.categoriesService.getList();
  }

  get total(): Observable<number> {
    return this.categoriesService.getTotal();
  }

  addCategoryButton() {
    const modal = this.dialogService.open(CategoriesFormComponent, {
      data: {},
      header: 'Crear',
    });

    modal.onClose.subscribe({
      next: value => {
        if (value?.success) {
          showSuccess(this.messageService, 'Categoría creada.');
          this.getCategories(this.limit, this.page, this.search);
        } else if (value?.error) {
          showError(this.messageService, value.error);
          this.getCategories(this.limit, this.page, this.search);
        }
      },
    });
  }

  editCategoryButton(id: number) {
    const modal = this.dialogService.open(CategoriesFormComponent, {
      data: {
        id,
      },
      header: 'Editar',
    });

    modal.onClose.subscribe({
      next: value => {
        if (value?.success) {
          showSuccess(this.messageService, 'Categoría actualizada.');
          this.getCategories(this.limit, this.page, this.search);
        } else if (value?.error) {
          showError(this.messageService, value.error);
          this.getCategories(this.limit, this.page, this.search);
        }
      },
    });
  }

  deleteCategoryButton(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas eliminar esta categoría?',
      header: 'Eliminar categoría',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.categoriesService.delete(id).subscribe({
          next: () => {
            showSuccess(this.messageService, 'La categoría ha sido eliminado');
            this.getCategories(this.limit, this.page, this.search);
          },
          error: () => {
            showError(
              this.messageService,
              'No se eleminó la categoría, intenteló nuevamente',
            );
            this.getCategories(this.limit, this.page, this.search);
          },
        });
      },
      reject: () => {},
    });
  }
}
