import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PizzaDetailPage } from './pizza-detail.page';

const routes: Routes = [{ path: '', component: PizzaDetailPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PizzaDetailPageRoutingModule {}
