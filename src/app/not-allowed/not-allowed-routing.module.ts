import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotAllowedComponent } from './not-allowed.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: NotAllowedComponent }]),
  ],
  exports: [RouterModule],
})
export class NotAllowedRoutingModule {}
