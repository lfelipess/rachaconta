import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhePessoaPage } from './detalhe-pessoa';

@NgModule({
  declarations: [
    DetalhePessoaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalhePessoaPage),
  ],
})
export class DetalhePessoaPageModule {}
