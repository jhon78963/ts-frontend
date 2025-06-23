import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-inventories.layout',
  standalone: true,
  imports: [ConfirmDialogModule, TabMenuModule, ToastModule, TabViewModule],
  templateUrl: './inventories.layout.component.html',
  styleUrl: './inventories.layout.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class InventoriesLayoutComponent {
  tabs: MenuItem[] = [
    {
      id: '1',
      label: 'Productos',
      routerLink: ['./products'],
    },
    {
      id: '2',
      label: 'Categorías',
      routerLink: ['./categories'],
    },
    {
      id: '3',
      label: 'Marcas',
      routerLink: ['./brands'],
    },
    {
      id: '4',
      label: 'Unidad de medidas',
      routerLink: ['./measurements'],
    },
  ];
  activeItem: MenuItem = this.tabs[0];
}
