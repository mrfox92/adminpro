import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
/* modelos */
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];
  termino: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    this.activatedRoute.params.subscribe( params => {
      // tslint:disable-next-line:prefer-const
      let termino = params.termino;
      this.buscar( termino );
      this.termino = termino;
    });
  }

  ngOnInit() {
  }

  buscar( termino: string ) {
    // tslint:disable-next-line:prefer-const
    let url = `${ URL_SERVICIOS }/busqueda/todo/${ termino }`;

    this.http.get( url ).subscribe( (resp: any) => {

      this.hospitales = resp.hospitales;
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;

    });
  }

}
