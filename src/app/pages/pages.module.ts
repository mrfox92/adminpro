import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
/* modulo graficas */
import { ChartsModule } from 'ng2-charts';
/* working with ngModel */
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

/* components */
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
/* sweet alert */
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

/* routes */
import { PAGES_ROUTES } from './pages.routes';

/* temporal */
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
/* pipes module */
import { PipesModule } from '../pipes/pipes.module';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccountSettingsComponent,
        PromesasComponent,
        RxjsComponent,
        ProfileComponent,
        UsuariosComponent,
        ModalUploadComponent,
        HospitalesComponent,
        MedicosComponent,
        MedicoComponent
    ],
    exports: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        BrowserModule,
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule,
        PipesModule,
        SweetAlert2Module
    ]
})
export class PagesModule { }
