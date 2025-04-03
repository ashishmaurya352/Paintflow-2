import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignTeamPageRoutingModule } from './assign-team-routing.module';

import { AssignTeamPage } from './assign-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignTeamPageRoutingModule
  ],
  // declarations: [AssignTeamPage]
})
export class AssignTeamPageModule {}
