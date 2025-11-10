import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PizzaDetailPageRoutingModule } from './pizza-detail-routing.module';
import { PizzaDetailPage } from './pizza-detail.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PizzaDetailPageRoutingModule],
  declarations: [PizzaDetailPage]
})
export class PizzaDetailPageModule {}
