import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Order-trackingPageRoutingModule } from './order-tracking-routing.module';
import { Order-trackingPage } from './order-tracking.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, Order-trackingPageRoutingModule],
  declarations: [Order-trackingPage]
})
export class Order-trackingPageModule {}
