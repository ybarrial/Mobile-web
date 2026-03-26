import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sede } from '../../models/mobile-web/sede';
import { Parametro } from '../../models/mobile-web/parametro';
import { Lastid } from '../../models/mobile-web/lastid';
import { SedeMinuscula } from '../../models/mobile-web/sede-minuscula';
import { Page } from '../../utils/page.model';


@Injectable({
  providedIn: 'root'
})
export class SedeService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sede";
  private cabezera = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getSearchResult(searchword: string, codempresa: number): Observable<Sede[]> {
    const baseUrl1 = this.URL_SISTEMA + "/findbysearch"
    return this.http.get<Sede[]>(`${baseUrl1}/${searchword}/${codempresa}`);
  }

  getSearchResultPaginado(searchword: string, codempresa: number, pageIndex: number, pageSize: number): Observable<Page<Sede>> {
    const baseUrl1 = this.URL_SISTEMA + "/findbysearch/paginado"
    return this.http.get<Page<Sede>>(`${baseUrl1}/${searchword}/${codempresa}/${pageIndex}/${pageSize}`);
  }

  descargarExcel(codempresa: number): Observable<HttpResponse<Blob>> {
    const url = `${this.URL_SISTEMA}/download-excel/${codempresa}`;
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

  bycodigo(codccosto: string): Observable<Sede[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listbycodigo"
    return this.http.get<Sede[]>(`${baseUrl1}/${codccosto}`);
  }

  bydescripcion(codccosto: string): Observable<Sede[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listbydescrip"
    return this.http.get<Sede[]>(`${baseUrl1}/${codccosto}`);
  }

  getSedes(): Observable<Sede[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado"
    return this.http.get<Sede[]>(`${baseUrl1}`);
  }

  getSedesByEmpresa(codempresa: number) {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado"
    return this.http.get<Sede[]>(`${baseUrl1}/${codempresa}`);
  }

  getLastid(): Observable<Lastid> {
    const baseUrl1 = this.URL_SISTEMA + "/find/lastid"
    return this.http.get<Lastid>(`${baseUrl1}`);
  }

  getSedesActivasbyEmpresa(codempresa: number): Observable<Sede[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado/activo"
    return this.http.get<Sede[]>(`${baseUrl1}/codempresa/${codempresa}`);
  }

  getSedesActivasbyEmpresaPaginado(codempresa: number, pageIndex: number, pageSize: number): Observable<Page<Sede>> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado/activo/paginado"
    return this.http.get<Page<Sede>>(`${baseUrl1}/codempresa/${codempresa}/${pageIndex}/${pageSize}`);
  }

  getSedesbyEmpresa(codempresa: number): Observable<Sede[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado"
    return this.http.get<Sede[]>(`${baseUrl1}/codempresa/${codempresa}`);
  }

  getSedesByEmpresaByUser(codempresa: number, codusuario: string): Observable<Sede[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado"
    return this.http.get<Sede[]>(`${baseUrl1}/codempresa/${codempresa}/codusuario/${codusuario}`);
  }

  getSedesbyEmpresaPaginado(codempresa: number, pageIndex: number, pageSize: number): Observable<Page<Sede>> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado/paginado"
    return this.http.get<Page<Sede>>(`${baseUrl1}/codempresa/${codempresa}/${pageIndex}/${pageSize}`);
  }

  crearSede(sede: Sede): Observable<Map<String, Object>> {
    const baseUrl2 = this.URL_SISTEMA + "/post";
    return this.http.post<Map<String, Object>>(baseUrl2, sede, { headers: this.cabezera });
  }

  postlistados(sede: SedeMinuscula[]): Observable<Map<String, Object>> {
    const baseUrl2 = this.URL_SISTEMA + "/post/listado/original";
    return this.http.post<Map<String, Object>>(baseUrl2, sede, { headers: this.cabezera });
  }

  obtenerSede(codsede: string): Observable<Sede> {
    let codempresa = JSON.parse(sessionStorage.getItem('empresa')!);
    const baseUrl3 = this.URL_SISTEMA + "/find/id";
    return this.http.get<Sede>(`${baseUrl3}/${codsede}/${codempresa}`);
  }

  modificarSede(sede: Sede): Observable<Sede> {
    const baseUrl4 = this.URL_SISTEMA + "/find/id";
    return this.http.put<Sede>(`${baseUrl4}/${sede.codsede}/${sede.codempresa}`, sede, { headers: this.cabezera });
  }

  eliminarSede(codsede: string): Observable<Map<String, Object>> {
    let codempresa = JSON.parse(sessionStorage.getItem('empresa')!);
    const baseUrl5 = this.URL_SISTEMA + "/find/id";
    return this.http.delete<Map<String, Object>>(`${baseUrl5}/${codsede}/${codempresa}`);
  }
}
