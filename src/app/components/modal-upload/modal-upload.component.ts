import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';
//  Sweet Alert
import { SweetAlertType } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
declare const $: any;
@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  @ViewChild('swalFileUpload') private swalFileUpload: SwalComponent;
  @ViewChild('file') private fileUpload: ElementRef;

  imagenSubir: File;
  imagenTemp: any;
  usuario: Usuario;

  constructor(
    public usuarioService: UsuarioService,
    public subirArchivoService: SubirArchivoService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.usuario;
  }

  reset() {
    //  console.log( this.fileUpload.nativeElement.files );
    this.fileUpload.nativeElement.value = '';
    //  console.log( this.fileUpload.nativeElement.files );

  }
  getMessage( titulo: string, texto: string, tipo: SweetAlertType) {

    this.swalFileUpload.title = titulo;
    this.swalFileUpload.text = texto;
    this.swalFileUpload.type = tipo;
    this.swalFileUpload.showConfirmButton = true;
    this.swalFileUpload.showCancelButton = false;
    this.swalFileUpload.confirmButtonText = 'Ok';
    this.swalFileUpload.cancelButtonText = 'Cancel';
    this.swalFileUpload.confirmButtonColor = '#3085d6';
    this.swalFileUpload.show();
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this.modalUploadService.ocultarModal();
    this.reset();
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
    .then( (resp: any) => {
      //  validamos de que el usuario que realiza la modificacion es el usuario logueado
      if ( resp.usuario ) {
        if ( this.usuario._id === resp.usuario._id ) {
          //  actualizamos la imagen de nuestro usuario logueado para el header y el sidebar
          this.usuario.img = resp.usuario.img;
          //  cargamos las actualizaciones al storage
          this.usuarioService.guardarStorage( this.usuario._id, this.usuarioService.token, this.usuario, this.usuarioService.menu );
        }
      }
      //  emitimos que ya se subio la imagen
      this.modalUploadService.notificacion.emit( resp );
      this.cerrarModal();
      this.reset();
      this.getMessage('Imagen subida', 'La imagen ha sido subida con éxito', 'success');
    })
    .catch( err => {
      console.log('Error en la carga...');
    });
  }

}
