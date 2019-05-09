import { Component, OnInit, Input } from '@angular/core';
/* importaciones para trabajar con chart.js & ng2-charts */
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  /* definición de atributos y sus respectivos tipos */
  public chartData: MultiDataSet;
  public chartLabels: Label;
  public chartType: ChartType;
  public chartLegend: string;

  /* data recibida desde el componente padre */
  @Input() grafico: any;

  constructor() {}

  /* inicializando atributos con la data que viene desde el componente padre */
  ngOnInit() {
    this.chartData = this.grafico.data;
    this.chartLabels =  this.grafico.labels;
    this.chartType = this.grafico.type;
    this.chartLegend = this.grafico.leyenda;
  }
}
