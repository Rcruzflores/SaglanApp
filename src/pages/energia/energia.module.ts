import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnergiaPage } from './energia';


import { GraficoComponent } from '/Users/ruben/app/src/components/grafico/grafico';

@NgModule({
  declarations: [
    EnergiaPage,GraficoComponent,
  ],
  imports: [
    IonicPageModule.forChild(EnergiaPage),
  ],
})
export class EnergiaPageModule {}
