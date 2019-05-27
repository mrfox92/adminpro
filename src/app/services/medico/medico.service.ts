import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { Medico } from '../../models/medico.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService
  ) { }


  cargarMedicos( desde: number = 0 ) {
    const url = `${ URL_SERVICIOS }/medico?desde=${ desde }`;
    return this.http.get( url );
  }

  cargarMedico( id: string ) {
    //  localhost:3000/medico/5ceb659ec5bc9e417edbb6f8
    const url = `${ URL_SERVICIOS }/medico/${ id }`;
    return this.http.get(url).pipe( map( (resp: any) => {
      return resp.medico;
    }) );
  }

  guardarMedico( medico: Medico ) {

    if ( medico._id ) {
      //  actualizar
      let url = `${ URL_SERVICIOS }/medico/${ medico._id }`;
      url += `?token=${ this.usuarioService.token }`;
      return this.http.put( url, medico );
    } else {
      //  crear
      let url = `${ URL_SERVICIOS }/medico`;
      url += `?token=${ this.usuarioService.token }`;
      return this.http.post( url, medico );
    }

  }

  buscarMedicos( termino: string ) {
    //   localhost:3000/busqueda/coleccion/medicos/a
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/medicos/${ termino }`;

    return this.http.get( url ).pipe( map( (resp: any) => resp.medicos ) );
  }
  borrarMedico( medico: Medico ) {
    //  localhost:3000/medico/5cdcdc89b6aab72fdb9bd9ac?token=
    let url = `${ URL_SERVICIOS }/medico/${ medico._id }`;
    url += `?token=${ this.usuarioService.token }`;
    return this.http.delete( url );
  }
}
