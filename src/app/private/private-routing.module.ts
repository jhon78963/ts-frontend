import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Home',
    data: { breadcrumb: 'Home' },
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'profile',
    title: 'Profile',
    data: { breadcrumb: 'Profile' },
    loadChildren: () =>
      import('./profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'administration',
    title: 'Administración',
    data: { breadcrumb: 'Administración' },
    loadChildren: () =>
      import('./administration/administration.module').then(
        m => m.AdministrationModule,
      ),
  },
  {
    path: 'inventories',
    title: 'Inventario',
    data: { breadcrumb: 'Inventario' },
    loadChildren: () =>
      import('./inventories/inventories.module').then(m => m.InventoriesModule),
  },
  {
    path: 'entities',
    title: 'Entidades',
    data: { breadcrumb: 'Entidades' },
    loadChildren: () =>
      import('./entities/entities.module').then(m => m.EntitiesModule),
  },
  {
    path: 'operations',
    title: 'Ordenes',
    data: { breadcrumb: 'Ordenes' },
    loadChildren: () =>
      import('./operations/operations.module').then(m => m.OperationsModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
    data: { breadcrumb: 'Home' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
