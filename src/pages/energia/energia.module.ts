import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnergiaPage } from './energia';


import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    EnergiaPage,
  ],
  imports: [
    IonicPageModule.forChild(EnergiaPage),
    ComponentsModule
  ],
})
export class EnergiaPageModule {}
