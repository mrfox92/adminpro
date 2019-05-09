import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  /* Para hacer referencia a un elemento html en particular
  utilizamos el decorador viewChild
  */

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Input() leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;
  /* emitimos un numero como un evento */
  @Output() actualizarValor: EventEmitter<number> = new EventEmitter();

  constructor() {
    /* console.log('Leyenda: ', this.leyenda ); */
    console.log('progreso: ', this.progreso );
  }

  ngOnInit() {
    /* console.log('Leyenda: ', this.leyenda ); */
    console.log('progreso: ', this.progreso );
  }

  onChange( newValue: number ) {
    /* falta controlar el valor de la caja input de tipo number de la posicion [1] */
    /* const elementHTML: any = document.getElementsByName('progreso')[0]; */
    /* console.log( this.txtProgress ); */
    if ( newValue >= 100 ) {
      this.progreso = 100;
    } else if ( newValue <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    /* controlar el largo del número ingresado por pantalla */
    /* elementHTML.value = this.progreso; */
    this.txtProgress.nativeElement.value = this.progreso;
    /* emitimos el evento Output (salida) */
    this.actualizarValor.emit( this.progreso );
  }

  cambiarValor( valor: number ) {

    if ( this.progreso >= 100 && valor > 0 ) {
      this.progreso = 100;
      return;
    }
    if ( this.progreso <= 0 && valor < 0 ) {
      this.progreso = 0;
      return;
    }
    this.progreso += valor;
    /* emitimos el evento Output (salida) */
    this.actualizarValor.emit( this.progreso );
    /* añadir el foco a elemento input html */
    this.txtProgress.nativeElement.focus();
  }
}
