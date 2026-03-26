import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Parametro } from '../../models/mobile-web/parametro';
import { Usuario } from '../../models/mobile-web/usuario';
import { Page } from '../../utils/page.model';
import { Imagenusuario } from '../../models/mobile-web/imagenusuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "usuario";
  private baseUrlinfouser = "http://190.187.4.81:28080/sitia/InfoUser";

  private _usuario: Usuario = new Usuario;

  private cabezera = new HttpHeaders({ 'Content-Type': 'application/json' })
  info: any[]=[];

  constructor(private http: HttpClient) { }

 // 📤 Subir imagen de usuario
uploadImage(file: File, codusuario: string): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('codusuario', codusuario);
  console.log('📤 Enviando imagen:', file.name, 'Usuario:', codusuario);

  return this.http.post(`${this.URL_SISTEMA}/upload/imagen`, formData, { responseType: 'text' }).pipe(
    tap(response => console.log('✅ Imagen subida correctamente:', response)),
    catchError(error => {
      console.error('❌ Error al subir imagen:', error);
      return throwError(error);
    })
  );
}

// 📥 Obtener Imagen de Usuario como Blob
getUserImage(usuario: string): Observable<Blob> {
  return this.http.get(`${this.URL_SISTEMA}/descargar/imagen/${usuario}`, { responseType: 'blob' });
}

// 📥 Descargar Imagen de Usuario como ArrayBuffer
downloadAndConvertImage(codusuario: string): Observable<ArrayBuffer> {
  const url = `${this.URL_SISTEMA}/find/imagen/${codusuario}`;
  return this.http.get(url, { responseType: 'arraybuffer' });
}


getImagen(usuario: string): Observable<Imagenusuario> {
  return this.http.get<Imagenusuario>(`${this.URL_SISTEMA}/find/imagen/${usuario}`)
}
  getSearchResult(searchword: string): Observable<Usuario[]> {
    const baseUrl1 = this.URL_SISTEMA + "/findbysearch"
    return this.http.get<Usuario[]>(`${baseUrl1}/${searchword}`);
  }

  getSearchResultPaginado(searchword: string, pageIndex: number, pageSize: number): Observable<Page<Usuario>> {
    const baseUrl1 = this.URL_SISTEMA + "/findbysearch/paginado"
    return this.http.get<Page<Usuario>>(`${baseUrl1}/${searchword}/${pageIndex}/${pageSize}`);
  }

  descargarExcel(): Observable<HttpResponse<Blob>> {
    const url = `${this.URL_SISTEMA}/download-excel`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map(response => {
        const blob = new Blob([response.body!], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const filename = response.headers.get('Content-Disposition')!.split(';')[1].trim().split('=')[1];
        const excelFile = new File([blob], filename, { type: blob.type });
        return new HttpResponse<Blob>({
          body: excelFile,
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
          url: response.url!
        });
      })
    );
  }

  getUsuarioSession(): any {
    if (JSON.parse(sessionStorage.getItem('usuario') || '')) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario') || '') as Usuario;
      if (this._usuario.usuario != null) {
        return this._usuario.usuario;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  obtenerUsuariobyuserid(usuario: string): Observable<Usuario> {
    const baseUrl3 = this.URL_SISTEMA + "/find/codusuario";
    return this.http.get<Usuario>(`${baseUrl3}/${usuario}`);
  }

  getUsuarioByUsuario(usuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.URL_SISTEMA}/find/usuario/${usuario}`)
  }

  ByUsuario(usuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.URL_SISTEMA}/find/${usuario}`)
  }

  

  validarUsuarios(usuario: Usuario): Observable<Usuario> {
    const baseUrl1 = this.URL_SISTEMA
    return this.http.get<Usuario>(`${baseUrl1}/${usuario.usuario}/${usuario.password}`);
  }

  //METODOS PARA SITIA
  getcantidadActivos(id: number): Observable<any[]> {
    const baseUrl1 = this.baseUrlinfouser + "/cantInventariado"
    return this.http.get<any[]>(`${baseUrl1}/${id}`);
  }

  getInfoTorta(id: number): Observable<any[]> {
    const baseUrl1 = this.baseUrlinfouser + "/Torta"
    return this.http.get<any[]>(`${baseUrl1}/${id}`);
  }

  getInfoBarra(id: number): Observable<any[]> {
    const baseUrl1 = this.baseUrlinfouser + "/Barra"
    return this.http.get<any[]>(`${baseUrl1}/${id}`);
  }
  //METODOS PARA PERFILCOMPONENT

  //METODOS PARA USUARIOCOMPONENT

  getListadoUsers(): Observable<Usuario[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado"
    return this.http.get<Usuario[]>(`${baseUrl1}`);
  }

  getUsuarioByRUC(ruc: string): Observable<Usuario[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/ruc";
    return this.http.get<Usuario[]>(`${baseUrl1}/${ruc}`);
  }

  getUsuarioByName(name: string): Observable<Usuario[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/name";
    return this.http.get<Usuario[]>(`${baseUrl1}/${name}`);
  }

  getUsuarioByRazonSocial(razon: string): Observable<Usuario[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/razonsocial";
    return this.http.get<Usuario[]>(`${baseUrl1}/${razon}`);
  }

  getUsuarioByestado(): Observable<Usuario[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/estado";
    return this.http.get<Usuario[]>(`${baseUrl1}`);
  }

  getUsuarioByestadoPaginado(pageIndex: number, pageSize: number): Observable<Page<Usuario>> {
    const baseUrl1 = this.URL_SISTEMA + "/find/estado/paginado";
    return this.http.get<Page<Usuario>>(`${baseUrl1}/${pageIndex}/${pageSize}`);
  }

  getAllSliced(): Observable<Usuario[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/all/sliced";
    return this.http.get<Usuario[]>(`${baseUrl1}`);
  }

  getAllPaginado(pageIndex: number, pageSize: number): Observable<Page<Usuario>> {
    const baseUrl1 = this.URL_SISTEMA + "/find/all/paginado";
    return this.http.get<Page<Usuario>>(`${baseUrl1}/${pageIndex}/${pageSize}`);
  }

  getUsuarioPagina(page: number): Observable<Usuario[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/page";
    return this.http.get<Usuario[]>(`${baseUrl1}/${page}`);
  }

  crearUsuario(Usuario: Usuario): Observable<Usuario> {
    const baseUrl2 = this.URL_SISTEMA + "/post";
    return this.http.post<Usuario>(baseUrl2, Usuario, { headers: this.cabezera });
  }

  obtenerUsuario(usuario: Usuario): Observable<Usuario> {
    const baseUrl3 = this.URL_SISTEMA + "/find/codusuario";
    return this.http.get<Usuario>(`${baseUrl3}/${usuario.usuario}`);
  }

  modificarUsuario(usuario: Usuario): Observable<Usuario> {
    const baseUrl4 = this.URL_SISTEMA + "/find/codusuario";
    return this.http.put<Usuario>(`${baseUrl4}/${usuario.usuario}`, usuario, { headers: this.cabezera });
  }

  actualizarEstadoUsuario(codusuario: string): Observable<Usuario> {
    const baseUrl4 = this.URL_SISTEMA + "/activar";
    return this.http.put<Usuario>(`${baseUrl4}/${codusuario}`, { headers: this.cabezera });
  }

  eliminarUsuario(usuario: Usuario): Observable<Usuario> {
    const baseUrl5 = this.URL_SISTEMA + "/find/codusuario";
    return this.http.delete<Usuario>(`${baseUrl5}/${usuario.usuario}`);
  }
}