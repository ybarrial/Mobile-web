import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../../models/mobile-web/menu';
import { Parametro } from '../../models/mobile-web/parametro';
import { Usuario } from '../../models/mobile-web/usuario';
import { map } from 'rxjs/operators';
import { Submenu } from '../../models/mobile-web/submenu';
import { Funcion } from '../../models/mobile-web/funcion';
import { Acceso } from '../../models/mobile-web/acceso';
import { DatePipe } from '@angular/common';
import { AuthResponse } from '../../models/mobile-web/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL_SISTEMA_PERFIL: string = Parametro.SISTEMA_URL + "perfil";
  private URL_SISTEMA_MENU: string = Parametro.SISTEMA_URL + "fgrupo";
  private URL_SISTEMA_SUBMENU: string = Parametro.SISTEMA_URL + "funcion";
  private URL_SISTEMA_ACCESO_RES: string = Parametro.SISTEMA_URL + "acceso";
  private URL_SISTEMA_AUTH: string = Parametro.SISTEMA_URL + "oauth/token";

  //private URL_SISTEMA_AUTH: string = "http://localhost:8010/oauth/token";
  /* private URL_SISTEMA_AUTH: string = Parametro.SISTEMA_SEGURIDAD + "oauth/token"; */
  private _usuario!: Usuario | null;
  private _token!: string | null;
  private date!: Date;

  constructor(private http: HttpClient,
    public datepipe: DatePipe) { }

  get usuario(): Usuario | null {
    if (this._usuario != null) {
      return this._usuario;
    }

    const usuarioStorage = sessionStorage.getItem('usuario');
    if (usuarioStorage) {
      this._usuario = JSON.parse(usuarioStorage) as Usuario;
      return this._usuario;
    }

    return null;
  }

  public get token(): string | null {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token')!;
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa('licencia-app' + ':' + '1323');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.usuario!);
    params.set('password', usuario.password!);
    //console.log(params.toString());
    return this.http.post<any>(this.URL_SISTEMA_AUTH, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(payload: AuthResponse): void {
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.usuario = payload.user_name;
    this._usuario.roles = payload.authorities;
    this.date = new Date();
    let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    sessionStorage.setItem('fecproceso', JSON.stringify(latest_date));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  isAuthenticated(): boolean {
    const user = this.usuario; // usa el getter, no el campo privado directamente
    return !!(user && user.usuario && user.usuario.length > 0);
  }

  isPermit(tusuario: string, url: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL_SISTEMA_SUBMENU}/list/funcion/${tusuario}/${url}`)
  }

  hasRole(role: string): boolean {
    if (this.usuario!.roles.includes(role)) {
      return true;
    }
    return false;
  }

  getAllMenu(): Observable<Menu[]> {
    return this.http.get(this.URL_SISTEMA_MENU + '/list').pipe(
      map((response) => response as Menu[])
    );
  }

  findMenuById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.URL_SISTEMA_MENU}/find/id/${id}`)
  }

  saveMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(`${this.URL_SISTEMA_MENU}/save`, menu);
  }

  accessMenu(usuario: String): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.URL_SISTEMA_MENU}/list/${usuario}`)
  }

  findById(id: number): Observable<Submenu> {
    return this.http.get<Submenu>(`${this.URL_SISTEMA_SUBMENU}/find/${id}`)
  }

  saveSubMenu(submenu: Funcion): Observable<Funcion> {
    return this.http.post<Funcion>(`${this.URL_SISTEMA_SUBMENU}/save`, submenu);
  }

  deleteSubMenu(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_SUBMENU}/delete/grupo/id/${id}`)
  }


  enableSubmenu(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_SUBMENU}/enable/id/${id}`)
  }

  disableSubmenu(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_SUBMENU}/disable/id/${id}`)
  }

  getAllDispSubMenuByCodGrupo(id: number): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/disp/codgrupo/${id}`)
  }

  getAllAsigSubMenuByCodGrupo(id: number): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/asig/codgrupo/${id}`)
  }

  accessSubMenuByUserAndGrupo(usuario: string, codfunsup: number): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/codgrupo/${usuario}/${codfunsup}`)
  }

  accessSubMenu(usuario: string, codfunsup: number): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/codfunsup/${usuario}/${codfunsup}`)
  }

  accessSubMenuByUsuario(usuario: string): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/${usuario}`)
  }

  accessRes(usuario: String): Observable<Acceso[]> {
    return this.http.get<Acceso[]>(`${this.URL_SISTEMA_ACCESO_RES}/list/usuario/${usuario}`)
  }

  addAccesoRes(acceso: Acceso): Observable<Acceso> {
    return this.http.post<Acceso>(`${this.URL_SISTEMA_ACCESO_RES}/save`, acceso);
  }

  deleteMenuRes(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_ACCESO_RES}/delete/id/${id}`)
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('empresa');
    sessionStorage.removeItem('sede');
    sessionStorage.removeItem("sedeNombre")
  }
}