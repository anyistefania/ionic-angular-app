import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedHeaderComponent } from '../components/shared-header/shared-header.component';

@NgModule({
  declarations: [
    SharedHeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    SharedHeaderComponent
  ]
})
export class SharedModule {}
