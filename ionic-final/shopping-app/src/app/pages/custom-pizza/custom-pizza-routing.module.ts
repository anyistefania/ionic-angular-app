import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomPizzaPage } from './custom-pizza.page';

const routes: Routes = [
  {
    path: '',
    component: CustomPizzaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomPizzaPageRoutingModule {}
