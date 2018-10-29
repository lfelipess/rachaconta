import { TestBed, async } from '@angular/core/testing';
import { MyApp } from './app.component';
import {
    PlatformMock,
    StatusBarMock,
    SplashScreenMock
} from '../../test-config/mocks-ionic';
import { IonicModule, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ProdutoProvider } from '../providers/produto-provider/produto';
import { UsuarioProvider } from '../providers/usuario-provider/usuario-provider';
import { MesaProvider } from '../providers/mesa-provider/mesa-provider';

const firebaseConfig = {
    apiKey: "AIzaSyCWgqXE-yiEticZmEucTN0oKcvS-x6c_Ds",
    authDomain: "rachaconta-1865b.firebaseapp.com",
    databaseURL: "https://rachaconta-1865b.firebaseio.com",
    projectId: "rachaconta-1865b",
    storageBucket: "rachaconta-1865b.appspot.com",
    messagingSenderId: "323903877704"
}

describe('MyApp Component', () => {
    let fixture;
    let component;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp],
            imports: [
                BrowserModule,
                IonicModule.forRoot(MyApp, {
                    scrollAssist: false,
                    autoFocusAssist: false
                }),
                AngularFireModule.initializeApp(firebaseConfig),
                AngularFireAuthModule,
                AngularFireDatabaseModule
            ],
            providers: [
                { provide: StatusBar, useClass: StatusBarMock },
                { provide: SplashScreen, useClass: SplashScreenMock },
                { provide: Platform, useClass: PlatformMock },
                MesaProvider,
                UsuarioProvider,
                ProdutoProvider
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyApp);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component instanceof MyApp).toBe(true);
    });

    it('should have two pages', () => {
        expect(component.pages.length).toBe(3);
    });

});