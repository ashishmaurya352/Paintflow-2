import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'activity-list',
    loadChildren: () => import('./pages/activity-list/activity-list.module').then( m => m.ActivityListPageModule)
  },
  {
    path: 'assign-team',
    loadChildren: () => import('./pages/assign-team/assign-team.module').then( m => m.AssignTeamPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'qa-dashboard',
    loadChildren: () => import('./pages/qa-dashboard/qa-dashboard.module').then( m => m.QaDashboardPageModule)
  },
  {
    path: 'requisition',
    loadChildren: () => import('./pages/requisition/requisition.module').then( m => m.RequisitionPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
