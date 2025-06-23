import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list/orders.component').then(c => c.OrdersListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/form/orders-form.component').then(
        c => c.OrdersFormComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/form/orders-form.component').then(
        c => c.OrdersFormComponent,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
