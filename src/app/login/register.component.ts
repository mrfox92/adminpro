import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
/* sweet alert */
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';
/* servicio */
import { UsuarioService } from '../services/service.index';
/* modelo */
import { Usuario } from '../models/usuario.model';
/* router */
import { Router } from '@angular/router';

declare function init_plugins();
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;
  /* Nos creamos una propiedad de tipo  */
  @ViewChild('swalMessage') private swalMessage: SwalComponent;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
    ) { }

  sonIguales( campo1: string, campo2: string ) {

    return ( group: FormGroup ) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if ( pass1 === pass2 ) {
        return null;
      }

      return {
        sonIguales: true
      };
    };
  }

  ngOnInit() {
    init_plugins();
    this.forma = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      correo: new FormControl( null, [Validators.required, Validators.email] ),
      password: new FormControl( null, Validators.required ),
      password2: new FormControl( null, Validators.required ),
      condiciones: new FormControl( false )
    }, { validators: this.sonIguales( 'password', 'password2' ) } );

    /* mandamos data de prueba al formulario*/
    this.forma.setValue({
      nombre: 'test',
      correo: 'test@test.com',
      password: '123456',
      password2: '123456',
      condiciones: true
    });
  }

  /* obtener mensaje sweet alert */
  getMessage( titulo: string, texto: string, tipo: SweetAlertType) {
      this.swalMessage.title = titulo;
      this.swalMessage.text = texto;
      this.swalMessage.type = tipo;
      this.swalMessage.show();
  }

  registrarUsuario() {

    if ( this.forma.invalid ) {
      this.getMessage('Registro no válido', 'Hay elementos del formulario que debes revisar', 'error');
      return;
    }

    if ( !this.forma.value.condiciones ) {
      /* mostramos nuestra alerta via sweet alert */
      this.getMessage('Importante', 'Debes aceptar los terminos y condiciones', 'warning');
      /* console.log(this.condicionesSwal); */
      return;
    }

    /* creamos nuestro usuario a registrar */
    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );
    /* llamamos el servicio */
    this.usuarioService.crearUsuario( usuario ).subscribe( resp => {
      if (resp) {
        /* mostramos la alerta y navegamos al login */
        this.getMessage( 'Usuario registrado', 'Usuario registrado exitosamente', 'success' );
        this.router.navigate(['/login']);
      }
      console.log( resp );
    });
  }

}
