import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { NgZone } from '@angular/core';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
                        .subscribe( resp => this.router.navigate(['/dashboard']) );
  }
}
