import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.scss',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];
  lang: any = '';

  getUserData() {
    const jsonData = localStorage.getItem('user');
    const userData = jsonData ? JSON.parse(jsonData) : undefined;
    return userData.role;
  }

  ngOnInit(): void {
    const isAdmin = this.getUserData();
    if (isAdmin == 'Admin') {
      this.model = [
        {
          label: 'Administración',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Roles',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/administration/roles'],
            },
            {
              label: 'Usuarios',
              icon: 'pi pi-fw pi-users',
              routerLink: ['/administration/users'],
            },
          ],
        },
        {
          label: 'Inventario',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Productos',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/inventories/products'],
            },
          ],
        },
        {
          label: 'Entidades',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Clientes',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/entities/customers'],
            },
            {
              label: 'Proveedores',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/entities/suppliers'],
            },
          ],
        },
        {
          label: 'Ordenes',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Compras',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/operations/orders'],
            },
            {
              label: 'Ventas',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/operations/sales'],
            },
          ],
        },
      ];
    } else {
      this.model = [
        {
          label: 'Inventario',
          icon: 'pi pi-home',
          routerLink: ['/inventories/products'],
        },
        {
          label: 'Entidades',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Clientes',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/entities/customers'],
            },
            {
              label: 'Proveedores',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/entities/suppliers'],
            },
          ],
        },
        {
          label: 'Ordenes',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Compras',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/operations/orders'],
            },
            {
              label: 'Ventas',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/operations/sales'],
            },
          ],
        },
      ];
    }
  }
}
