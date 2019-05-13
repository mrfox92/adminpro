import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    /* then: este bloque se ejecutará en caso de que la promesa cumpla una determinada condición
    y sea resuelta.
    catch: se ejecutará en caso de que la promesa termine con algun error( reject ), entonces esta función
    manipulará dicho(s) fallo(s).
     */

     /* Ahora vemos que podemos utilizar funciones que retornan promesas y luego nos permiten
     ejecutar los callbacks en caso de resolver o en caso de fallo */
     this.contarTres().then(
      mensaje => console.log('terminó: ', mensaje)
    )
    .catch( error => console.error('Error en la promesa', error) );

  }

  ngOnInit() {
  }

  /* gracias  a typescript podemos definidr el tipo de dato que retornará la función
  en este caso retorna una promesa, con un valor de tipo boolean*/
  contarTres(): Promise<boolean> {

    /* retornamos nuestra promesa */
    return  new Promise( (resolve, reject) => {
      let contador = 0;
      const intervalor = setInterval( () => {
        contador += 1;
        console.log(contador);
        if ( contador === 3 ) {
          resolve(true);
          /* reject('Simplemente un error'); */
          clearInterval( intervalor );
          console.log('función intervalo off!!');
        }

      }, 1000);

    });

  }

}
