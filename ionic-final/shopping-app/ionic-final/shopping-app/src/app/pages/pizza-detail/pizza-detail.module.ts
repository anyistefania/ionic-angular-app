import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Pizza-detailPageRoutingModule } from './pizza-detail-routing.module';
import { Pizza-detailPage } from './pizza-detail.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, Pizza-detailPageRoutingModule],
  declarations: [Pizza-detailPage]
})
export class Pizza-detailPageModule {}
