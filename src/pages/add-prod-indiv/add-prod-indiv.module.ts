import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProdIndivPage } from './add-prod-indiv';

@NgModule({
  declarations: [
    AddProdIndivPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProdIndivPage),
  ],
})
export class AddProdIndivPageModule {}
