import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeRatePage } from './change-rate.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeRatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeRatePageRoutingModule {}
