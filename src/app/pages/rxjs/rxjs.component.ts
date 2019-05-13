import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    /* nos suscribimos al observable.
    Los observables reciben tres callbacks:
    1. cuando se llama un next.
    2. el siguiente es un error.
    3. el tercero es ejecutado cuando el observable termina
    */


    /* Cuando se presenta un error en nuestro observable debemos
     hacer algo para manejar ese error */

     /* la función pipe me permite definir una serie de operadores:
     1. retry(numero intentos): en este operador podemos definir un número
     de reintentos para intentar re-conectar.*/

    /* solo son emitidos los números impares en el callback que se ejecuta cuando es llamado
    un next*/
    this.subscription = this.regresaObservable().pipe()
    .subscribe(
      numero => console.log('Subs', numero),
      error => console.error('Error en el obs ', error),
      () => console.log('El observador terminó!')
    );
  }

  ngOnInit() {
  }

  /* Esta función se ejecutará cada vez que nos vayamos de la página, ya que corresponde
  al ciclo de vida del componente, el cual se encarga de destruir el mismo. */

  ngOnDestroy() {
    console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }
  /*map(): cuando queremos procesar la data antes de enviar la podemos pasar por el operador
  map, este operador se encarga de tomar la data que viene en bruto
  y transformar la salida de esta data. Básicamente es la misma información
  que estamos recibiendo pero expresada de otra manera */

  /* filter(): este operador nos ayuda a filtrar los resultados una vez obtenemos la información,
  así podemos solo estar al pendiente de lo que nos interesa.
  Este operador a fuerza tiene que retornar un true o un false, este retorno funciona
  como respuesta para emitir (true) o no(false) un resultado.
  Recibe dos parametros:
  -El primero es el valor o la respuesta.
  -El segundo es un index, que lleva el conteo del numero de veces que se
  ha llamado este operador filter */

  regresaObservable(): Observable<any> {

     return  new Observable( (observer: Subscriber<any> ) => {
      let contador = 0;
      const intervalo = setInterval( () => {
        contador ++;
        const salida = {
          valor: contador
        };
        observer.next( salida );
        /* if ( contador === 3 ) {
          clearInterval( intervalo );
          observer.complete();
        } */

        /* if ( contador === 2 ) {
          observer.error('Se ha presentado un error');
        } */
      }, 1000);
    }).pipe(
      map( resp => resp.valor ),
      filter( ( valor, index ) => {
        /* retornamos los números impares */
        if ( valor % 2 === 0 ) {
          /* par */
          return false;
        } else {
          /* impar */
          return true;
        }
      })
    );

  }
}
