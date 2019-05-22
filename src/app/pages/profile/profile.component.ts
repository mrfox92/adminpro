import { Component, OnInit, ViewChild } from '@angular/core';
/* sweet alert */
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  @ViewChild('swalMessage') private swalMessage: SwalComponent;
  usuario: Usuario;

  imagenSubir: File;
  imagenTemp: any;

  constructor(
    public usuarioService: UsuarioService
  ) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit() {
  }

  /* obtener mensaje sweet alert */
  getMessage( titulo: string, texto: string, tipo: SweetAlertType) {

    this.swalMessage.title = titulo;
    this.swalMessage.text = texto;
    this.swalMessage.type = tipo;
    this.swalMessage.show();
}

  guardar( usuario: Usuario ) {

    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }
    this.usuarioService.actualizarUsuario( this.usuario ).subscribe( resp => {
      this.getMessage('Usuario actualizado', `${ resp }`, 'success');
    });
  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    //  excluimos elementos en caso de no ser una imagen
    if ( archivo.type.indexOf('image') < 0 ) {
      this.getMessage( 'Solo imágenes', 'El archivo seleccionado no es una imagen', 'error' );
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    //  obtener la ruta temporal de la imagen con vanilla javascript
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );
    //  reader.result obtiene el data image base64
    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  cambiarImagen() {
    this.usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id ).subscribe( resp => {
      if ( resp ) {
        this.getMessage( 'Imagen perfil actualizada', 'Tu foto de perfil ha sido actualizada con éxito', 'success' );
      } else {
        this.getMessage( 'Imagen usuario error', 'la imagen no ha ha podido ser actualizada', 'error' );
      }
    });
  }

}
