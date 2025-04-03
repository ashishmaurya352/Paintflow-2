import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QaDashboardPageRoutingModule } from './qa-dashboard-routing.module';

import { QaDashboardPage } from './qa-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QaDashboardPageRoutingModule
  ],
  // declarations: [QaDashboardPage]
})
export class QaDashboardPageModule {}
