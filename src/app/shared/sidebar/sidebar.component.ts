import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/service.index';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;
  constructor(
    public usuarioService: UsuarioService,
    public sidebar: SidebarService,
    public modalUploadService: ModalUploadService
    ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.usuario;
    this.modalUploadService.notificacion.subscribe( (resp: any) => {
      /* validamos si el usuario que ha cambiado la imagen es el mismo que está autenticado
      si es verdadero entonces actualizamos la imagen del usuario autenticado por la que ha subido
      se debe actualizar tanto en el sidebar como en el header navbar.
       */
      if ( resp.usuario ) {
        if ( this.usuario._id === resp.usuario._id ) {
          //  actualizamos la imagen de nuestro usuario logueado para el header y el sidebar
          this.usuario.img = resp.usuario.img;
          //  cargamos las actualizaciones al storage
          this.usuarioService.guardarStorage( this.usuario._id, this.usuarioService.token, this.usuario );
        }
      }
    });
  }

}
