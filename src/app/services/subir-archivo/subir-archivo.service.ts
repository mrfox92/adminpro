import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: string ) {

    //  creamos una promesa para notificar luego de que la peticion ajax sea completada
    return new Promise( (resolve, reject) => {
      //  este es el payload que queremos mandar a subir
      const formData = new FormData();
      //  inicializamos la petición ajax con vanilla javascript
      const xhr = new XMLHttpRequest();
      //  configuramos el formData, donde se envia la informacion del elemento a subir
      formData.append( 'imagen', archivo, archivo.name );
      //  configuramos la peticion ajax
      //  onreadystatechange nos notificará en caso de cualquier cambio
      xhr.onreadystatechange = () => {
        if ( xhr.readyState === 4 ) {
          if ( xhr.status === 200 ) {
            console.log( 'Imagen subida' );
            resolve( JSON.parse( xhr.response ) );
          } else {
            console.log( 'Fallo la subida' );
            reject( xhr.response );
          }
        }
      };

      //  la url hacia donde se manda hacer la peticion ajax
      const url = URL_SERVICIOS + `/upload/${ tipo }/${ id }`;
      xhr.open( 'PUT', url, true );
      //  enviamos el formData
      xhr.send( formData );
    });

  }
}
