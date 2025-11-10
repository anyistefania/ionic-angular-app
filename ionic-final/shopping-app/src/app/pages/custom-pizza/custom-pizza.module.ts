import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomPizzaPageRoutingModule } from './custom-pizza-routing.module';
import { CustomPizzaPage } from './custom-pizza.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
        CustomPizzaPageRoutingModule
  ],
  declarations: [
    CustomPizzaPage
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ✅ Para Swiper

})
export class CustomPizzaPageModule {}
