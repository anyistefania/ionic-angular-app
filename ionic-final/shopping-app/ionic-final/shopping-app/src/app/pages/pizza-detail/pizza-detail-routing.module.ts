import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Pizza-detailPage } from './pizza-detail.page';

const routes: Routes = [{ path: '', component: Pizza-detailPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Pizza-detailPageRoutingModule {}
