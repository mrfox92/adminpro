import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
/* modulo graficas */
import { ChartsModule } from 'ng2-charts';
/* trabajar con ngModel */
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
/* routes */
import { PAGES_ROUTES } from './pages.routes';

/* temporal */
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent
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
        ChartsModule
    ]
})
export class PagesModule { }
