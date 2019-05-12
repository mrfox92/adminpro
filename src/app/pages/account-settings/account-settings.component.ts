import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor( public settingsService: SettingsService ) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor( tema: string, link: any ) {
    this.aplicarCheck( link );
    this.settingsService.aplicarTema( tema );
  }

  aplicarCheck( link: any ) {
    const selectores: any = document.getElementsByClassName('selector');
    /* barremos los elementos para remover la clase working de todos nuestros elementos */
    for (const ref of selectores) {
      ref.classList.remove('working');
    }
    /* finalmente añadimos la clase working al elemento que se ha seleccionado actualmente */
    link.classList.add('working');
  }

  colocarCheck() {
    const selectores: any = document.getElementsByClassName('selector');
    const tema = this.settingsService.ajustes.tema;
    for ( const ref of selectores ) {
      if ( ref.getAttribute('data-theme') === tema ) {
        ref.classList.add('working');
        break;
      } else {
        ref.classList.remove('working');
      }
    }
  }
}
