import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  //  todo canActivate puede retornar un observable, una promesa o un boolean

  constructor(
    public usuarioService: UsuarioService
  ) {}
  canActivate() {

    if ( this.usuarioService.usuario.role === 'ADMIN_ROLE' ) {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      this.usuarioService.logOut();
      return false;
    }
  }
}

