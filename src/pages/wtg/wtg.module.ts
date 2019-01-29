import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WtgPage } from './wtg';


import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    WtgPage
  ],
  imports: [
    IonicPageModule.forChild(WtgPage),
    ComponentsModule
  ],
})
export class WtgPageModule {}
