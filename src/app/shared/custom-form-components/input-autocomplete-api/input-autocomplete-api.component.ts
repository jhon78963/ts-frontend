import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ApiService } from '../../../services/api.service';
import {
  AutocompleteResponse,
  AutocompleteSaveResponse,
} from '../../models/autocomplete.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { showError, showSuccess } from '../../../utils/notifications';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-input-autocomplete-api',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    OverlayPanelModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './input-autocomplete-api.component.html',
  styleUrl: './input-autocomplete-api.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class InputAutocompleteApiComponent implements OnInit, OnChanges {
  @Input() placeholder: string | null = null;
  @Input() label: string | null = null;
  @Input() for: string | null = null;
  @Input() type: string | null = null;
  @Input() id: string | null = null;
  @Input() readonly: boolean = false;
  @Input() collectionToCall: string | null = null;
  @Input() queryParam: string | null = null;
  @Input() collectionToSave: string | null = null;
  @Input() collectionToEdit: any;
  @Input() bodyColumn: string = '';
  @Input() multipleOptions: boolean = false;
  @Input() itemId: number = 0;
  isDropdownOpen: boolean = false;
  itemSelected = output<AutocompleteResponse | null>();
  private keyToAddString = '+ ';
  collection: any[] = [];

  formGroup: FormGroup = new FormGroup({
    item: new FormControl(),
  });

  constructor(
    private readonly apiService: ApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private elementRef: ElementRef,
  ) {}

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePressed() {
    this.isDropdownOpen = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemId'] && this.itemId) {
      this.apiService
        .get<AutocompleteResponse>(`${this.collectionToCall}/${this.itemId}`)
        .subscribe({
          next: (res: AutocompleteResponse) => {
            if (res) {
              this.formGroup
                .get('item')
                ?.setValue(res.value, { emitEvent: false });
              this.itemSelected.emit(res);
            }
            this.isDropdownOpen = true;
          },
        });
    } else if (changes['itemId'] && this.itemId === 0) {
      this.clearFilter();
    }
  }

  ngOnInit(): void {
    if (this.collectionToEdit) {
      this.formGroup
        .get('item')
        ?.setValue(this.collectionToEdit, { emitEvent: false });
    }
    this.formGroup
      .get('item')
      ?.valueChanges.pipe(debounceTime(200))
      .subscribe((value: string | null) => {
        this.collection = [];
        if (value) {
          this.apiService
            .get<
              AutocompleteResponse[]
            >(`${this.collectionToCall}?${this.queryParam}=${value}`)
            .subscribe({
              next: (res: AutocompleteResponse[]) => {
                if (res.length > 0) {
                  this.collection = res;
                } else {
                  this.collection.push({
                    id: 0,
                    value: `${this.keyToAddString}${value}`,
                  });
                }
                this.isDropdownOpen = true;
              },
            });
        } else {
          this.collection = [];
          this.isDropdownOpen = false;
        }
      });
  }

  clearFilter() {
    this.formGroup.get('item')?.setValue(null);
    this.collection = [];
    this.itemSelected.emit(null);
  }

  getAllItems() {
    const value = this.formGroup.get('item')?.value;
    if (!this.isDropdownOpen && (!value || value.trim() === '')) {
      this.apiService
        .get<AutocompleteResponse[]>(`${this.collectionToCall}`)
        .subscribe({
          next: (res: AutocompleteResponse[]) => {
            if (res.length > 0) {
              this.collection = res;
              this.isDropdownOpen = true;
            }
          },
        });
    } else {
      this.isDropdownOpen = true;
    }
  }

  addNewItem(item: AutocompleteResponse) {
    this.confirmationService.confirm({
      message: 'Por favor confirme para continuar.',
      header: '¿Crear registro?',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        const formatterItem = {
          id: item.id,
          [this.bodyColumn]: item.value,
        };
        this.apiService
          .post<AutocompleteSaveResponse>(
            `${this.collectionToSave}`,
            formatterItem,
          )
          .subscribe({
            next: (newItem: AutocompleteSaveResponse) => {
              this.itemSelected.emit(newItem.item);
              showSuccess(this.messageService, 'Registro exitoso!');
            },
            error: () => {
              showError(
                this.messageService,
                'Ocurrió un error, intente nuevamente',
              );
            },
          });
      },
      reject: () => {
        this.collection = [];
        this.formGroup.get('item')?.setValue('');
      },
    });
  }

  getSelecteditem(item: AutocompleteResponse) {
    const formattedItem = {
      id: item.id,
      value: item.value.replace(this.keyToAddString, '').toUpperCase(),
    };
    this.formGroup
      .get('item')
      ?.setValue(formattedItem.value, { emitEvent: false });
    if (item.id > 0) {
      this.itemSelected.emit(formattedItem);
    } else {
      this.addNewItem(formattedItem);
    }
    this.collection = [];
  }
}
