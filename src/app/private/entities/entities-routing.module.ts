import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'customers',
    title: 'Clientes',
    data: { breadcrumb: 'Clientes' },
    loadChildren: () =>
      import('./customers/customers.module').then(m => m.CustomersModule),
  },
  {
    path: 'suppliers',
    title: 'Proveedores',
    data: { breadcrumb: 'Proveedores' },
    loadChildren: () =>
      import('./suppliers/suppliers.module').then(m => m.SuppliersModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule {}
