import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPessoaPage } from './add-pessoa';

@NgModule({
  declarations: [
    AddPessoaPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPessoaPage),
  ],
})
export class AddPessoaPageModule {}
