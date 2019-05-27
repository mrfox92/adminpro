import { Component, OnInit, ViewChild } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
/* sweet alert */
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  @ViewChild('swalMessageHospitales') private swalMessageHospitales: SwalComponent;
  @ViewChild('swalInputModal') private swalInputModal: SwalComponent;
  @ViewChild('swalDeleteHospital') private swalDeleteHospital: SwalComponent;
  hospitales: Hospital[] = [];
  totalRegistros: number = 0;
  loading: boolean = true;
  desde: number = 0;
  tipo: string = 'hospital';
  constructor(
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    //  refrescar los cambios en pantalla
    this.modalUploadService.notificacion.subscribe( resp => this.cargarHospitales() );
  }

  actualizarIMagen( id: string ) {
    this.modalUploadService.mostrarModal( 'hospitales', id );
  }

  cargarModal() {
    //  Swal input
    this.swalInputModal.type = 'question';
    this.swalInputModal.title = 'Registrar nuevo hospital';
    this.swalInputModal.showConfirmButton = true;
    this.swalInputModal.confirmButtonText = 'Guardar';
    this.swalInputModal.showCancelButton = true;
    this.swalInputModal.cancelButtonText = 'Cancelar';
    this.swalInputModal.input = 'text';
    this.swalInputModal.inputPlaceholder = 'Ingrese nombre hospital';
    this.swalInputModal.show()
        .then( resp =>  {
          if ( resp.dismiss ) {
            console.log('Modal disminuido');
            return;
          }
          resp.value.trim( resp.value );
          if ( resp.value.length > 0 ) {
            //  entonces guardamos el nuevo hospital
            const nombre: string = resp.value;
            this.hospitalService.crearHospital( nombre ).subscribe( data => {
              console.log( data );
              this.cargarHospitales();
              this.getMessage('Hospital agregado', 'Nuevo hospital ha sido agregado exitosamente', 'success');
            });
            return;
          } else {
            console.log('Input vacío');
            return;
          }
          //  console.log(resp);
        })
        .catch( err => {
          console.log(err);
        });
  }
  /* obtener mensaje sweet alert */
  getMessage( titulo: string, texto: string, tipo: SweetAlertType) {

    this.swalMessageHospitales.title = titulo;
    this.swalMessageHospitales.text = texto;
    this.swalMessageHospitales.type = tipo;
    this.swalMessageHospitales.showConfirmButton = true;
    this.swalMessageHospitales.showCancelButton = false;
    this.swalMessageHospitales.confirmButtonText = 'Ok';
    this.swalMessageHospitales.cancelButtonText = 'Cancel';
    this.swalMessageHospitales.confirmButtonColor = '#3085d6';
    this.swalMessageHospitales.show();
  }

  cargarHospitales() {
    this.loading = true;
    this.hospitalService.cargarHospitales( this.desde ).subscribe( (resp: any) => {
      this.hospitales = resp.hospitales;
      this.totalRegistros = resp.total;
      this.loading = false;
    });
  }

  cambiarDesde( valor: number ) {
    let desde = this.desde;
    desde += valor;
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }

    this.desde = desde;
    this.cargarHospitales();

  }

  actualizarHospital( nombre: string, hospital: Hospital ) {
    //  quitamos los espacios en blanco en ambos extremos con la funcion trim()
    nombre = nombre.trim();
    if ( nombre.length > 0 ) {
      hospital.nombre = nombre;
      this.hospitalService.actualizarHospital( hospital ).subscribe( resp => {
        if ( resp ) {
          this.getMessage('Hospital actualizado', 'El hospital ha sido actualizado con éxito', 'success');
        }
      });
    } else {
      this.getMessage('Error al actualizar', 'El nombre de hospital es obligatorio, por favor reintente', 'warning');
    }
  }

  buscarHospital( termino: string ) {
    /* pendiente: paginacion de resultados */
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.hospitalService.buscarHospital( termino ).subscribe( hospitales => {
      this.hospitales = hospitales;
    });
  }

  borrarHospital( hospital: Hospital ) {
    this.swalDeleteHospital.title = '¿Estás seguro?';
    this.swalDeleteHospital.text = `¿Deseas borrar ${ hospital.nombre }?`;
    this.swalDeleteHospital.type = 'question';
    this.swalDeleteHospital.showConfirmButton = true;
    this.swalDeleteHospital.showCancelButton = true;
    this.swalDeleteHospital.confirmButtonText = 'Borrar';
    this.swalDeleteHospital.cancelButtonText = 'Cancelar';
    this.swalDeleteHospital.focusCancel = true;
    this.swalDeleteHospital.confirmButtonColor = '#ef5350';
    this.swalDeleteHospital.cancelButtonColor = '#3085d6';
    this.swalDeleteHospital.show().then( (data) => {
      if ( data.value === true ) {
        this.hospitalService.borrarHospital( hospital ).subscribe( resp => {
          this.cargarHospitales();
          this.getMessage( 'Hospital borrado', 'hospital eliminado correctamente', 'success' );
        });
      }
    });
    return;
  }

}
