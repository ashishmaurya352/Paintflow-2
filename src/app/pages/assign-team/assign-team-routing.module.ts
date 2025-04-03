import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignTeamPage } from './assign-team.page';

const routes: Routes = [
  {
    path: '',
    component: AssignTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignTeamPageRoutingModule {}
