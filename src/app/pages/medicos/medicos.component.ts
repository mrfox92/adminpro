import { Component, OnInit, ViewChild } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  @ViewChild('swalDelete') private swalDelete: SwalComponent;
  @ViewChild('swalMessageMedicos') private swalMessageMedicos: SwalComponent;

  medicos: Medico[] = [];
  totalRegistros: number = 0;
  loading: boolean = true;
  desde: number = 0;

  constructor(
    public medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.loading = true;
    this.medicoService.cargarMedicos( this.desde ).subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.medicos = resp.medicos;
      this.loading = false;
    });
  }

  cambiarDesde( valor: number ) {
    let desde = this.desde + valor;
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }

    this.desde = desde;
    this.cargarMedicos();
  }

  buscarMedico( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }
    this.loading = true;
    this.medicoService.buscarMedicos( termino ).subscribe( ( medicos: Medico[] ) => {
      this.medicos = medicos;
      this.loading = false;
    });
  }

  borrarMedico( medico: Medico ) {
    this.swalDelete.title = '¿Estás seguro?';
    this.swalDelete.text = `¿Deseas borrar a ${ medico.nombre }?`;
    this.swalDelete.type = 'question';
    this.swalDelete.showConfirmButton = true;
    this.swalDelete.showCancelButton = true;
    this.swalDelete.confirmButtonText = 'Borrar';
    this.swalDelete.cancelButtonText = 'Cancelar';
    this.swalDelete.focusCancel = true;
    this.swalDelete.confirmButtonColor = '#ef5350';
    this.swalDelete.cancelButtonColor = '#3085d6';
    this.swalDelete.show().then( (data) => {
      if ( data.value === true ) {
        this.medicoService.borrarMedico( medico ).subscribe( resp => {
          this.cargarMedicos();
          this.getMessage( 'Medico borrado', 'Medico eliminado correctamente', 'success' );
        });
      }
    });
    return;
  }

  getMessage( titulo: string, texto: string, tipo: SweetAlertType ) {

    this.swalMessageMedicos.title = titulo;
    this.swalMessageMedicos.text = texto;
    this.swalMessageMedicos.type = tipo;
    this.swalMessageMedicos.showConfirmButton = true;
    this.swalMessageMedicos.showCancelButton = false;
    this.swalMessageMedicos.confirmButtonText = 'Ok';
    this.swalMessageMedicos.cancelButtonText = 'Cancel';
    this.swalMessageMedicos.confirmButtonColor = '#3085d6';
    this.swalMessageMedicos.show();
  }

}
