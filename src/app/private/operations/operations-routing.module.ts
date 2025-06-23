import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'orders',
    title: 'Compras',
    data: { breadcrumb: 'Compras' },
    loadChildren: () =>
      import('./orders/orders.module').then(m => m.OrdersModule),
  },
  {
    path: 'sales',
    title: 'Ventas',
    data: { breadcrumb: 'Ventas' },
    loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsRoutingModule {}
