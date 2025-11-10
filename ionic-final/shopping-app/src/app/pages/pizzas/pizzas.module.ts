import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PizzasPageRoutingModule } from './pizzas-routing.module';
import { PizzasPage } from './pizzas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PizzasPageRoutingModule
  ],
  declarations: [PizzasPage]
})
export class PizzasPageModule {}
