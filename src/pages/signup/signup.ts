import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  private form:FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder:FormBuilder
  ,private alertCtrl:AlertController, private fire:AngularFireAuth,private usuarioProvider:UsuarioProvider) {
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({
      nome:['', Validators.required],
      dataNascimento:['', Validators.required],
      sexo:['', Validators.required],
      email:['',Validators.required],
      senha:['',Validators.required],
      confirmSenha:['',Validators.required]
    })
  }

  cadastrar(){
    
    if(this.form.value.senha == this.form.value.confirmSenha){
      if(this.form.valid){
            this.fire.auth.createUserWithEmailAndPassword(this.form.value.email,this.form.value.senha).then((certo)=>{
              this.form.value.key=certo.user.uid;
              delete this.form.value.senha;
              delete this.form.value.confirmSenha;
              this.usuarioProvider.save(this.form.value)
              this.navCtrl.setRoot(LoginPage);
            },
            (erro)=>{
              console.log(erro);
          })
      }else{
        this.alertErro("Preencha todos os Campos com asterisco (*)");
      }
    }else{
      this.alertErro("Senhas Distintas");
    }
  }

  alertErro(erro:string){
    let alert = this.alertCtrl.create({
      title:'Formulario Incorreto',
      subTitle:erro,
      buttons:['Ok']
    })
    alert.present();
  }

  cancelar(){
    this.navCtrl.setRoot(LoginPage);
  }

}
