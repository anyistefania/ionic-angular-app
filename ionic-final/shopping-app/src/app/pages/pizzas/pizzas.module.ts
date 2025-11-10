import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PizzasPageRoutingModule } from './pizzas-routing.module';
import { PizzasPage } from './pizzas.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PizzasPageRoutingModule,
    SharedModule
  ],
  declarations: [
    PizzasPage
  ]
})
export class PizzasPageModule {}
