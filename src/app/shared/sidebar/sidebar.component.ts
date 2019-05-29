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
    ) {}

  ngOnInit() {
    this.cargarUsuario();
    this.sidebar.cargarMenu();
    this.modalUploadService.notificacion.subscribe( () => {
      this.cargarUsuario();
    });
  }

  cargarUsuario() {
    this.usuario = this.usuarioService.usuario;
  }

}
