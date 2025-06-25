import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list/sales.component').then(c => c.SalesListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/form/sales-form.component').then(
        c => c.SalesFormComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/form/sales-form.component').then(
        c => c.SalesFormComponent,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
