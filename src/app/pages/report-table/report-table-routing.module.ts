import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportTablePage } from './report-table.page';

const routes: Routes = [
  {
    path: '',
    component: ReportTablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportTablePageRoutingModule {}
