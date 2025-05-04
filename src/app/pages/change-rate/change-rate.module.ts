import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeRatePageRoutingModule } from './change-rate-routing.module';

// import { ChangeRatePage } from './change-rate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeRatePageRoutingModule
  ],
  // declarations: [ChangeRatePage]
})
export class ChangeRatePageModule {}
