import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/inventories.layout.component').then(
        c => c.InventoriesLayoutComponent,
      ),
    children: [
      {
        path: 'products',
        title: 'Productos',
        data: { breadcrumb: 'Productos' },
        loadChildren: () =>
          import('./products/products.module').then(m => m.ProductsModule),
      },
      {
        path: 'brands',
        title: 'Marcas',
        data: { breadcrumb: 'Marcas' },
        loadChildren: () =>
          import('./brands/brands.module').then(m => m.BrandsModule),
      },
      {
        path: 'categories',
        title: 'Categorías',
        data: { breadcrumb: 'Marcas' },
        loadChildren: () =>
          import('./categories/categories.module').then(
            m => m.CategoriesModule,
          ),
      },
      {
        path: 'measurements',
        title: 'Unidad de medidas',
        data: { breadcrumb: 'Unidad de medidas' },
        loadChildren: () =>
          import('./measurements/measurements.module').then(
            m => m.MeasurementsModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoriesRoutingModule {}
