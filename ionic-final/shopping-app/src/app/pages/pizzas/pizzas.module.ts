import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PizzasPageRoutingModule } from './pizzas-routing.module';
import { PizzasPage } from './pizzas.page';
import { SharedHeaderComponent } from '../../components/shared-header/shared-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PizzasPageRoutingModule,
    SharedHeaderComponent,
    PizzasPage
  ]
})
export class PizzasPageModule {}
