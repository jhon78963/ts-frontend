import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [PrivateComponent],
  imports: [CommonModule, PrivateRoutingModule],
  providers: [ConfirmationService, DialogService, MessageService, DatePipe],
})
export class PrivateModule {}
