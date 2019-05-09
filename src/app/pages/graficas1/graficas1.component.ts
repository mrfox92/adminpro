import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styles: []
})
export class Graficas1Component implements OnInit {

  /* tarea: crear 4 gráficas de donas y que cada una de las gráficas
  utilice cada uno de los elementos del objeto graficos. Además se debe crear
  un componente reutilizable (graficoDona.component.ts y graficoDona.component.html).
  Este componente especializado debe recibir como inputs: la data, labels, el Type y la legenda.
  Toda esta data se envía desde el componente padre al componente hijo. */

  /* data graficos */

  graficos: any = {
    grafico1: {
      labels: ['Con Frijoles', 'Con Natilla', 'Con tocino'],
      data:  [24, 30, 46],
      type: 'doughnut',
      leyenda: 'El pan se come con'
    },
    grafico2: {
      labels: ['Hombres', 'Mujeres'],
      data:  [4500, 6000],
      type: 'doughnut',
      leyenda: 'Entrevistados'
    },
    grafico3: {
      labels: ['Si', 'No'],
      data:  [95, 5],
      type: 'doughnut',
      leyenda: '¿Le dan gases los frijoles?'
    },
    grafico4: {
      labels: ['No', 'Si'],
      data:  [85, 15],
      type: 'doughnut',
      leyenda: '¿Le importa que le den gases?'
    },
  };

  public charts: any[] = [];

  constructor() {
    /* pasamos cada uno de los objetos a un array de objetos */
    for (const key in this.graficos) {
      if (this.graficos.hasOwnProperty(key)) {
        const grafico = this.graficos[key];
        this.charts.push( grafico );
      }
    }
  }

  ngOnInit() {
  }

}
