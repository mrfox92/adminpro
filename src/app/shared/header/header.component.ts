import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService,
    public router: Router
    ) { }

  ngOnInit() {
    this.cargarUsuario();
    this.modalUploadService.notificacion.subscribe( () => {
      this.cargarUsuario();
    });
  }

  buscar( termino: string ) {
    this.router.navigate(['/busqueda', termino]);
  }

  cargarUsuario() {
    this.usuario = this.usuarioService.usuario;
  }
}
