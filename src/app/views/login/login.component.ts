import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaestrosService } from '../../services/maestros.service';
import { AuthService } from '../../services/mobile-web/auth.service';
import { Usuario } from '../../models/mobile-web/usuario';
import { AppComponent } from '../../app.component';
import { Empresa } from '../../models/mobile-web/empresa';
import { Sede } from '../../models/mobile-web/sede';
import { EmpresaService } from '../../services/mobile-web/empresa.service';
import { SedeService } from '../../services/mobile-web/sede.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit, OnDestroy {

  formUsuario!: FormGroup;
  formEmpresa!: FormGroup;
  
  windowForm: number = 0;
  currentIndex: number = 0;

  showPassword: boolean = false;
  isDisabled: boolean = false;
  isValid: boolean = false;

  valorText: string = "Validar";

  empresas: Empresa[] = [];
  sedes: Sede[] = [];

  usuarioLogeado: Usuario = new Usuario;

  videos: string[] = [
    'assets/videos/regina.mp4',
    'assets/videos/regina.mp4',
    'assets/videos/regina.mp4',
    'assets/videos/regina.mp4',
    'assets/videos/regina.mp4'
  ];

  @ViewChild('videoPlayer') video!: ElementRef<HTMLVideoElement>;

  constructor(
    private router: Router,
    private service: AuthService,
    private formBuilder: FormBuilder,
    private maestrosService: MaestrosService,
    //private exchangeRateService: ExchangeRateService


    private authService: AuthService,
    private appts: AppComponent,
    private sedeService: SedeService,
    private empresaService: EmpresaService
  ) {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    document.documentElement.style.overflow = 'hidden';
    this.onbuildFormUsuario();
    this.onBuildFormEmpresa();
    if (this.authService.isAuthenticated()) {
      //this.router.navigate(['/Principal']);
      this.router.navigate(['/home']);
    }
  }

  ngAfterViewInit() {
    const videoEl = this.video.nativeElement;
    videoEl.muted = true; // 🔇 sin audio siempre
    videoEl.src = this.videos[this.currentIndex];
    videoEl.load();
    videoEl.play();

    videoEl.onended = () => {
      this.nextVideo();
    };
  }

  ngOnDestroy(): void {
    document.documentElement.style.overflow = '';
  }

  onbuildFormUsuario() {
    this.formUsuario = this.formBuilder.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  nextVideo() {
    this.currentIndex = (this.currentIndex + 1) % this.videos.length;
    const videoEl = this.video.nativeElement;
    videoEl.src = this.videos[this.currentIndex];
    videoEl.load();
    videoEl.play();
  }

  playVideo() {
    const videoEl = this.video.nativeElement;
    videoEl.src = this.videos[this.currentIndex];
    videoEl.load();
    videoEl.play();
  }

  onBuildFormEmpresa() {
    this.formEmpresa = this.formBuilder.group({
      empresa: ['', Validators.required],
      sede: ['', Validators.required]
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.valida_login()) {
      if (this.valorText == "Validar") {
        this.authService.login(this.formUsuario.value)
          .subscribe((response) => {
            this.valorText = "Ingresar"
            this.windowForm = 1;
            this.isDisabled = true;
            sessionStorage.setItem('codusuario', JSON.stringify(this.formUsuario.controls['usuario'].value));
            this.authService.guardarUsuario(response);
            this.authService.guardarToken(response.access_token);
            this.usuarioLogeado = this.authService.usuario!;

            const codusuario = JSON.parse(sessionStorage.getItem('codusuario') || '""');

            if (codusuario == 'ADMIN') {
              sessionStorage.setItem('empresaNombre', '');
              sessionStorage.setItem('nombre_usuario', JSON.stringify('ADMINISTRADOR'));
              sessionStorage.setItem('empresa', '0');
              sessionStorage.setItem('sedeNombre', '');
              sessionStorage.setItem('sede', '0');
              this.appts.accessMenu(this.usuarioLogeado);
              this.appts.getUsuario(this.usuarioLogeado);
              this.appts.login();
              //this.router.navigate(['/Principal']);
              this.router.navigate(['/home']);
            } else {
              this.onlistEmpresas();
            }
          }, () => {
            Swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
          });
      }
    }  
  }

  get usuario(): string {
    return this.formUsuario.controls['usuario'].value;
  }

  get contrasena(): string {
    return this.formUsuario.controls['password'].value;
  }

  valida_login(): boolean {
    if ((this.usuario == undefined || this.usuario == null || this.usuario.length < 3)
      || (this.contrasena == undefined || this.contrasena == null || this.contrasena == '')) {
      Swal.fire({
        title: 'Error!',
        text: "Debe ingresar credenciales de autenticación",
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
      return false;
    } else {
      return true;
    }
  }

  login2() {
    if (this.valorText == "Ingresar") {
      this.guardar();
      //this.appts.accessMenu(this.usuarioLogeado);
      this.appts.getUsuario(this.usuarioLogeado);
      this.appts.login();
      this.router.navigate(['/home']);
    }
  }

  actualizarSede() {
    var id = this.formEmpresa.controls['empresa'].value;
    var userid = JSON.parse(sessionStorage.getItem('codusuario') || '""');
    this.sedes = [];
    this.sedeService.getSedesByEmpresaByUser(id, userid)
      .subscribe(response => {
        this.sedes = response;
      });
  }

  onSedeSeleccionada() {
    this.isDisabled = false;
  }

  onlistEmpresas() {
    this.empresas = [];
    this.empresaService.getEmpresaListadoActivos()
      .subscribe(rpta => {
        this.empresas = rpta;
      });
  }

  guardar() {
    for (let empresa of this.empresas) {
      if (this.formEmpresa.controls['empresa'].value == empresa.id) {
        sessionStorage.setItem('empresaNombre', empresa.razonsocial!);
        sessionStorage.setItem('empresa', empresa.id!.toString());
      }
    }
    for (let sede of this.sedes) {
      if (this.formEmpresa.controls['sede'].value == sede.codsede) {
        sessionStorage.setItem('sedeNombre', sede.descripcion!);
        sessionStorage.setItem('sede', sede.codsede!);
      }
    }
  }

}