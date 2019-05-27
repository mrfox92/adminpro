import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService
  ) {
    this.usuarioService.cargarStorage();
  }

  //  implementar la paginacion
  cargarHospitales( desde: number = 0, todo: boolean = false ) {
  //  retornar un observable con todos los hospitales
  //  localhost:3000/hospital
  let url = `${ URL_SERVICIOS }/hospital`;
  if (todo) {
    url += `?todo=${ todo }`;
  } else {
    url += `?desde=${ desde }`;
  }
  return this.http.get(url);
  }

  obtenerHospital( id: string ) {
    //  retorna la data del hospital
    const url = `${ URL_SERVICIOS }/hospital/${ id }`;
    return this.http.get( url ).pipe( map( (resp: any) => resp.hospital ) );
  }

  crearHospital( nombre: string ) {
    //  recibe el nombre del hospital y lo crea
    //  localhost:3000/hospital?token=token
    let url = `${ URL_SERVICIOS }/hospital`;
    url += `?token=${ this.usuarioService.token }`;
    //  console.log('Nombre hospital: ', nombre);
    return this.http.post( url, { nombre } );
  }

  buscarHospital( termino: string ) {
    //  recibe el termino de busqueda y retorna todos los hospitales que coincidan con ese termino de busqueda
    //  localhost:3000/busqueda/coleccion/hospitales/hospital
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/hospitales/${ termino }`;

    return this.http.get( url ).pipe( map( (resp: any) => resp.hospitales ));

  }

  actualizarHospital( hospital: Hospital ) {
    //  recibe un hospital y lo actualiza
    //  localhost:3000/hospital/5cdc8d49ff395a0dcc0b9012?token=aksgaskhasg
    let url = `${ URL_SERVICIOS }/hospital/${ hospital._id }`;
    url += `?token=${ this.usuarioService.token }`;

    return this.http.put( url, hospital ).pipe( map( (resp: any) => resp.hospital ) );
  }

  borrarHospital( hospital: Hospital ) {
    //  Recibe un ID de un hospital y lo borra
    //  localhost:3000/hospital/5cdc4b699bab2c7454b7abf2?token=token
    let url = `${ URL_SERVICIOS }/hospital/${ hospital._id }`;
    url += `?token=${ this.usuarioService.token }`;
    return this.http.delete( url );
  }

}

