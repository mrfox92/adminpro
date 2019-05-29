import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable, from, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //  Propiedades para saber si un usuario está autenticado
  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirarchivoService: SubirArchivoService
    ) {
    //  console.log('Servicio de usuario listo!');
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify( usuario ) );
    localStorage.setItem('menu', JSON.stringify( menu ) );
    //  Seteamos el usuario y el token para posterior comprobación
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logOut() {
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
                    .pipe( map( (resp: any) => {
                      this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
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
                      this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
                      return true;
                    }))
                    .pipe(
                      catchError( err => this.handleError( err ))
                    );
  }


//  ===========================
//  Manejo de errores
//  ===========================

  handleError(error) {
    //  let errorMessage = '';
    /* si el contenido dentro de error es una instancia de ErrorEvent */
    /* if ( error.error instanceof ErrorEvent ) {
      //  Client-side error
      errorMessage = `Error: ${ error.error.mensaje }`;
    } else {
      //  Server-side error
      errorMessage = `${ error.error.mensaje }`;
    } */

    //  window.alert(errorMessage);
    //  console.log( errorMessage );
    return throwError(error);
  }

  //  registrar un usuario
  crearUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario';
    //  realizamos la peticion a nuestro servicio
    return this.http.post( url, usuario )
                    .pipe( map( (resp: any) => {
                      return resp.usuario;
                    }) )
                    .pipe(
                      catchError( err => this.handleError( err ))
                    );
  }

  //  actualizar un usuario
  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    //  console.log( url );

    return this.http.put( url, usuario )
                    .pipe( map( (resp: any) => {
                      //  validamos de que el usuario que realiza la modificacion es el usuario logueado
                      if ( usuario._id === this.usuario._id ) {
                        const usuarioDB: Usuario = resp.usuario;
                        this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
                        return true;
                      } else {
                        return false;
                      }
                    }));
  }

  cambiarImagen( archivo: File, id: string ): Observable<any> {
    return from(this.subirarchivoService.subirArchivo( archivo, 'usuarios', id )
        .then( (resp: any) => {
          //  validamos de que el usuario que realiza la modificacion es el usuario logueado
          if ( resp.usuario ) {
            if ( this.usuario._id === resp.usuario._id ) {
              this.usuario.img = resp.usuario.img;
              this.guardarStorage( id, this.token, this.usuario, this.menu );
            }
          }
          return resp;
        })
        .catch( resp => {
          console.log( resp );
          return false;
        }));
  }

  cargarUsuarios( desde: number = 0 ) {
    //  localhost:3000/usuario?desde=5
    const url = `${ URL_SERVICIOS }/usuario?desde=${ desde }`;

    return this.http.get( url );
  }

  buscarUsuarios( termino: string ) {
    //   localhost:3000/busqueda/coleccion/usuarios/test
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/usuarios/${ termino }`;

    return this.http.get( url ).pipe( map( (resp: any) => resp.usuarios ) );
  }

  borrarUsuario( id: string ) {
    //  localhost:3000/usuario/5cdb38bdea089e3e257eebba?token=kasashhasjas
    let url = `${ URL_SERVICIOS }/usuario/${ id }`;
    url += '?token=' + this.token;

    return this.http.delete( url ).pipe( map( resp => {
      return true;
    }));

  }
}
