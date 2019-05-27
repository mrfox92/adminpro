import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService } from '../../services/service.index';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from '../../models/medico.model';
/* Sweet Alert */
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  @ViewChild('swalMessageMedico') private swalMessageMedico: SwalComponent;
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');
  todo: boolean = true;
  desde: number = 0;
  accion: string;
  constructor(
    public medicoService: MedicoService,
    public hospitalService: HospitalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService

  ) {
    this.activatedRoute.params.subscribe( parametros => {
      // tslint:disable-next-line:prefer-const
      let id = parametros.id;
      //  console.log(id);
      //  evaluamos los parametros que vienen por url en caso de crear o editar medico
      if ( id !== 'nuevo' ) {
        this.cargarMedico( id );
        this.accion = 'actualizar';
      } else {
        this.accion = 'crear';
      }
    });
  }

  ngOnInit() {
    this.hospitalService.cargarHospitales(this.desde, this.todo).subscribe( (resp: any) => this.hospitales = resp.hospitales );

    this.modalUploadService.notificacion.subscribe( resp => {
      this.medico.img = resp.medico.img;
    });
  }

  getMessage( titulo: string, texto: string, tipo: SweetAlertType ) {

    this.swalMessageMedico.title = titulo;
    this.swalMessageMedico.text = texto;
    this.swalMessageMedico.type = tipo;
    this.swalMessageMedico.showConfirmButton = true;
    this.swalMessageMedico.showCancelButton = false;
    this.swalMessageMedico.confirmButtonText = 'Ok';
    this.swalMessageMedico.cancelButtonText = 'Cancel';
    this.swalMessageMedico.confirmButtonColor = '#3085d6';
    this.swalMessageMedico.show();
  }

  cargarMedico( id: string ) {
    this.medicoService.cargarMedico( id ).subscribe( medico => {
      this.hospital = medico.hospital;
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      //  console.log( this.medico.hospital );
    });
  }

  guardarMedico( f: NgForm ) {

    if ( f.invalid ) {
      return;
    }

    this.medicoService.guardarMedico( this.medico ).subscribe( (resp: any) => {

      if ( this.accion === 'crear' ) {
        this.getMessage('Nuevo Medico', 'Nuevo medico creado correctamente', 'success');
        //  navegamos a la ruta de edicion de medico
        this.medico._id = resp.medico._id;
        this.router.navigate(['/medico', resp.medico._id]);
      } else {
        this.getMessage('Medico actualizado', 'informacion medico ha sido actualizada', 'success');
        this.medico._id = resp.medico._id;
        this.router.navigate(['/medico', resp.medico._id]);
      }
    });
  }

  cambioHospital( id: string ) {
    this.hospitalService.obtenerHospital( id ).subscribe( hospital => this.hospital = hospital );
  }

  cambiarImagen() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
