import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PizzasPage } from './pizzas.page';

const routes: Routes = [
  {
    path: '',
    component: PizzasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PizzasPageRoutingModule {}
