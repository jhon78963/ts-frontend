import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAllowedRoutingModule } from './not-allowed-routing.module';
import { NotAllowedComponent } from './not-allowed.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [CommonModule, NotAllowedRoutingModule, ButtonModule],
  declarations: [NotAllowedComponent],
})
export class NotAllowedModule {}
