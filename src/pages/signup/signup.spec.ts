import { FormBuilder } from '@angular/forms';
import { SignupPage } from './signup';

describe('UC001-CADASTRO DE USUARIO', () => {

    let component: SignupPage;

    beforeEach(() => {
        component = new SignupPage(null, new FormBuilder(), null, null, null);
        component.createForm();
    });

    it('E-mail invalido', () => {
        let errors = {};
        let email = component.form.controls['email'];
        email.setValue('joao@.com');
        errors = email.errors || {};
        expect(errors['email']).toBeTruthy();
    });

    it('E-mail em branco', () => {
        let errors = {};
        let email = component.form.controls['email'];
        let password = component.form.controls['senha'];
        password.setValue('63835');
        errors = email.errors || {};
        expect(errors['required']).toBeTruthy();
    });

    it('Senha em branco', () => {
        let errors = {};
        let email = component.form.controls['email'];
        let password = component.form.controls['senha'];
        email.setValue('joao@yahoo.com');
        errors = password.errors || {};
        expect(errors['required']).toBeTruthy();
    });
});