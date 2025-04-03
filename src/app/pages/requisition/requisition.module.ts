import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequisitionPageRoutingModule } from './requisition-routing.module';

import { RequisitionPage } from './requisition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequisitionPageRoutingModule
  ],
  // declarations: [RequisitionPage]
})
export class RequisitionPageModule {}
