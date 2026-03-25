import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/mobile-web/auth.service';
import { Menu } from './models/mobile-web/menu';
import { Usuario } from './models/mobile-web/usuario';
import { UsuarioService } from './services/mobile-web/usuario.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router
  ) {}

  title = 'Mobile Web';
  auth: boolean = false;
  menus: Menu[]=[];
  usuarioPanel: string | null = null;

  getUsuario(usuario: Usuario) {
    this.usuarioPanel = null;
    if (usuario) {
      this.usuarioService.getUsuarioByUsuario(usuario.usuario!).subscribe(
        (result) => {
          sessionStorage.setItem('nombre_usuario', JSON.stringify(result.nombre));
          this.usuarioPanel = result.nombre!;
          window.location.reload();
        }, error => {
          console.log(error);
        }
      );
    }
  }

  accessMenu(usuario: Usuario) {
    this.authService.accessMenu(usuario.usuario!).subscribe(
      (result) => {
        this.menus = result;
        //console.log(result);
        this.menus.forEach(menu => {
          this.authService.accessSubMenuByUserAndGrupo(usuario.usuario!, menu.id!).subscribe(
            (result) => {
              //console.log(result);
              menu.maefuncion = result;
              result.forEach(sub => {
                if (sub.desurl == null && sub.codfuncionsup == null) {
                  this.authService.accessSubMenu(usuario.usuario!, sub.id!).subscribe(
                    (result) => {
                      //console.log(result);
                      sub.submenu = result;
                      sub.submenu.forEach((subsub: any) => {
                        if (subsub.desurl == null && subsub.codfuncionsup != null) {
                          this.authService.accessSubMenu(usuario.usuario!, subsub.id).subscribe(
                            (result) => {
                              subsub.submenu = result;
                              //console.log(subsub.submenu);
                            }, error => {
                              console.log(error);
                            }
                          );
                        }
                      });
                    }, error => {
                      console.log(error);
                    }
                  );
                }
              });
            }, error => {
              console.log(error);
            }
          );
        });
      }, error => {
        console.log(error);
      }
    );
  }

  login() {
    this.auth = this.authService.isAuthenticated();
    this.changeDetectorRefs.detectChanges();
  }

  logout(): void {
    let username = this.authService.usuario!.usuario;
    this.authService.logout();
    this.auth = this.authService.isAuthenticated();
    this.changeDetectorRefs.detectChanges();
    //Swal.fire('Logout', `Hola ${username}, has cerrado sesión con éxito!`, 'success');
    this.router.navigate([""]);
  }


}
