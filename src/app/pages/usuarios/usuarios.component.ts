import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
/* sweet alert */
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

@ViewChild('swalMessageUsuarios') private swalMessageUsuarios: SwalComponent;
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  cargando: boolean = true;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    /* nos suscribimos a la emision de las notificaciones desde el servicio del modal upload
    gracias a este evento emitido podremos refrescar los cambios en la p�gina actual
    */
    this.modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios() );
  }

  mostrarModal( id: string ) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

   /* obtener mensaje sweet alert */
   getMessage( titulo: string, texto: string, tipo: SweetAlertType) {

    this.swalMessageUsuarios.title = titulo;
    this.swalMessageUsuarios.text = texto;
    this.swalMessageUsuarios.type = tipo;
    this.swalMessageUsuarios.showConfirmButton = true;
    this.swalMessageUsuarios.showCancelButton = false;
    this.swalMessageUsuarios.confirmButtonText = 'Ok';
    this.swalMessageUsuarios.cancelButtonText = 'Cancel';
    this.swalMessageUsuarios.confirmButtonColor = '#3085d6';
    this.swalMessageUsuarios.show();
  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde ).subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });

  }

  cambiarDesde( valor: number ) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log( desde );

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this.usuarioService.buscarUsuarios( termino ).subscribe( ( usuarios: Usuario[] ) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }


  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this.usuarioService.usuario._id ) {
      this.getMessage( 'No puede borrar usuario', 'No se puede borrar a si mismo', 'error' );
      return;
    } else {
      this.swalMessageUsuarios.title = '¿Estás seguro?';
      this.swalMessageUsuarios.text = `¿Deseas borrar a ${ usuario.nombre }?`;
      this.swalMessageUsuarios.type = 'question';
      this.swalMessageUsuarios.showConfirmButton = true;
      this.swalMessageUsuarios.showCancelButton = true;
      this.swalMessageUsuarios.confirmButtonText = 'Borrar';
      this.swalMessageUsuarios.cancelButtonText = 'Cancelar';
      this.swalMessageUsuarios.focusCancel = true;
      this.swalMessageUsuarios.confirmButtonColor = '#ef5350';
      this.swalMessageUsuarios.cancelButtonColor = '#3085d6';
      this.swalMessageUsuarios.show().then( (data) => {
        if ( data.value === true ) {
          this.usuarioService.borrarUsuario( usuario._id ).subscribe( resp => {
            console.log( resp );
            this.cargarUsuarios();
            this.getMessage( 'Usuario borrado', 'usuario eliminado correctamente', 'success' );
          });
        }
      });
      return;
    }
  }


  guardarUsuario( usuario: Usuario ) {
    this.usuarioService.actualizarUsuario( usuario ).subscribe( resp => {
      this.getMessage( 'Usuario actualizado', 'El usuario ha sido actualizado exitosamente', 'success' );
    });
  }

}
