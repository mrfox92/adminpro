import { Injectable, EventEmitter } from '@angular/core';

declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo: string;
  public id: string;

  public oculto: string = '';
  /* se emitira un objeto de tipo any,este será el objeto respuesta
  del servicio de carga de imagenes
  */
  public notificacion = new EventEmitter<any>();

  constructor() {
    console.log('Modal upload service working!!');
  }

  ocultarModal() {
    $('#myModal').modal('hide');
    this.id = null;
    this.tipo = null;
  }

  mostrarModal( tipo: string, id: string ) {
    $('#myModal').modal('show');
    this.id = id;
    this.tipo = tipo;
  }
}
