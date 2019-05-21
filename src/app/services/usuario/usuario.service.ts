import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //  Propiedades para sabe si un usuario está autenticado
  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router
    ) {
    console.log('Servicio de usuario listo!');
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify( usuario ) );
    //  Seteamos el usuario y el token para posterior comprobación
    this.usuario = usuario;
    this.token = token;
  }

  logOut() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
                    .pipe( map( (resp: any) => {
                      this.guardarStorage( resp.id, resp.token, resp.usuario );
                      return true;
                    }));
  }

  login( usuario: Usuario, recordar: boolean = false ) {
    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario )
                    .pipe( map( (resp: any) => {
                      this.guardarStorage( resp.id, resp.token, resp.usuario );
                      return true;
                    }));
  }

  //  registrar un usuario
  crearUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario';
    //  realizamos la peticion a nuestro servicio
    return this.http.post( url, usuario )
                    .pipe( map( (resp: any) => {
                      return resp.usuario;
                    }) );
  }
}
