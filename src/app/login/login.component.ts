import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { NgZone } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('swalLoginMessage') private swalLoginMessage: SwalComponent;

  email: string;
  recuerdame: boolean = false;
  auth2: any;
  constructor(
    public router: Router,
    public usuarioService: UsuarioService,
    private zone: NgZone
    ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1 ) {
      this.recuerdame = true;
    }
  }
  getMessage( titulo: string, texto: string, tipo: SweetAlertType) {

    this.swalLoginMessage.title = titulo;
    this.swalLoginMessage.text = texto;
    this.swalLoginMessage.type = tipo;
    this.swalLoginMessage.showConfirmButton = true;
    this.swalLoginMessage.showCancelButton = false;
    this.swalLoginMessage.confirmButtonText = 'Ok';
    this.swalLoginMessage.cancelButtonText = 'Cancel';
    this.swalLoginMessage.confirmButtonColor = '#3085d6';
    this.swalLoginMessage.show();
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '327442123631-ddmogfvtmaj85f772epgfk8dn1sqhpfr.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignIn( document.getElementById('btnGoogle') );
    });
  }


  attachSignIn( element ) {
    this.auth2.attachClickHandler( element, {}, ( googleUser ) => {
      //  const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;
      /* ejecutamos la peticion a nuestro servicio dentro de una zona
      así logramos eliminar el inconveniente del template y los plugins
       */
      this.zone.run( () => {
        this.usuarioService.loginGoogle( token ).subscribe( () => this.router.navigate(['/dashboard']) );
      });
    });
  }

  ingresar( forma: NgForm ) {

    if ( forma.invalid ) {
      return;
    }

    const usuario = new Usuario( null, forma.value.email, forma.value.password);
    this.usuarioService.login( usuario, this.recuerdame )
                        .subscribe(
                          resp => this.router.navigate(['/dashboard']),
                          err => {
                            this.getMessage('Error acceso', err, 'error');
                          }
                          );
  }
}
