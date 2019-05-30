import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) {}
  canActivate(): Promise<boolean> | boolean {
    console.log('Token Guard');
    /* Obtenemos el token para verificar si esta a punto de expirar y renovarlo */
    // tslint:disable-next-line:prefer-const
    let token = this.usuarioService.token;
    //  Los token en jwt son internamente un string codificado en base64
    /* La funcion atob() decodifica una cadena de datos que ha sido codificada utilizando
    la codificacion en base64 */
    // tslint:disable-next-line:prefer-const
    let payload = JSON.parse( atob( token.split('.')[1] ) );
    /* luego de decodificar el payload del token obtenemos la informacion publica del mismo.
    Junto con ello obtenemos la fecha de expiracion del token, la cual nos  permite evaluar
    cuando un token esta por expirar y renovarlo automaticamente
     */
    // tslint:disable-next-line:prefer-const
    let expirado = this.expirado( payload.exp );
    // si la funcion expirado retorna un true entonces el token está expirado
    if ( expirado ) {
      this.router.navigate(['/login']);
      return false;
    }
    //  si la funcion retorna un false quiere decir que el token no ha expirado y sigue siendo válido
    //  Ahora nos queda evaluar si el token esta proximo a vencer, de ser así hay que renovarlo automaticamente

    //  console.log( payload );
    return this.verificarRenovar( payload.exp );
  }

  verificarRenovar( fechaExp: number ): Promise<boolean> {
    //  retornamos una promesa
    return new Promise( ( resolve, reject ) => {
      //  expresamos la fecha expiracion del token en milisegundos
      // tslint:disable-next-line:prefer-const
      let tokenExp = new Date( fechaExp * 1000 );
      //  fecha del sistema
      // tslint:disable-next-line:prefer-const
      let ahora = new Date();
      //  expresamos la fecha actual del sistema en milisegundos
      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) );
      //  console.log( tokenExp );
      //  console.log( ahora );
      //  si el token es mayor entonces aun no esta proximo a expirar
      // 4 horas ( 3 * 60 * 60 * 1000 ) > ahora( 4 horas(milisegundos))
      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        //  El token es menor que 'ahora'( más el tiempo sumado ) está proximo a vencer y debe ser renovado
        this.usuarioService.renuevaToken()
            .subscribe( resp => {
              resolve(true);
            }, err => {
              reject(false);
              this.router.navigate(['/login']);
            });
      }
      resolve(true);
    });
  }

  expirado( fechaExp: number ) {
    /* la funcion getTime() nos devuelve millisegundos, por lo cual la dividimos entre 1000
    para convertirla a segundos, ya que la fecha de expiracion del token (payload.exp) viene
    expresada en segundos
     */
    // tslint:disable-next-line:prefer-const
    let ahora = new Date().getTime() / 1000;

    //  Evaluamos si la fecha del token es aun valida en comparacion con la fecha actual del sistema
    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }
  }
}
