import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportTablePageRoutingModule } from './report-table-routing.module';

import { ReportTablePage } from './report-table.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportTablePageRoutingModule
  ],
  // declarations: [ReportTablePage]
})
export class ReportTablePageModule {}
