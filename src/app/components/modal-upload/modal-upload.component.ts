import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';
declare const $: any;
@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: any;

  constructor(
    public subirArchivoService: SubirArchivoService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this.modalUploadService.ocultarModal();
  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    //  excluimos elementos en caso de no ser una imagen
    if ( archivo.type.indexOf('image') < 0 ) {
      //  this.getMessage( 'Solo imágenes', 'El archivo seleccionado no es una imagen', 'error' );
      this.imagenSubir = null;
      return;
    }
    /* generamos el preview de la imagen a subir */
    this.imagenSubir = archivo;
    //  obtener la ruta temporal de la imagen con vanilla javascript
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );
    //  reader.result obtiene el data image base64
    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  subirImagen() {
    this.subirArchivoService.subirArchivo( this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id )
    .then( resp => {
      //  emitimos que ya se subio la imagen
      this.modalUploadService.notificacion.emit( resp );
      this.cerrarModal();
    })
    .catch( err => {
      console.log('Error en la carga...');
    });
  }

}
