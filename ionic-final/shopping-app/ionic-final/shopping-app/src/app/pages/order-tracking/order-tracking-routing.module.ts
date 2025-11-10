import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Order-trackingPage } from './order-tracking.page';

const routes: Routes = [{ path: '', component: Order-trackingPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Order-trackingPageRoutingModule {}
