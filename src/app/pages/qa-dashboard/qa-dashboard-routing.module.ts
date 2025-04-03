import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QaDashboardPage } from './qa-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: QaDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QaDashboardPageRoutingModule {}
