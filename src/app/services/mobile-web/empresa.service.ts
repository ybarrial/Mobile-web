import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Page } from '../../utils/page.model';
import { Empresa } from '../../models/mobile-web/empresa';
import { Parametro } from '../../models/mobile-web/parametro';
import { Enviopocket } from '../../models/mobile-web/enviopocket';


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "empresa";
  private cabezera = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) {
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

  uploadFile(file: File, id: number): Observable<any> {
    let url = this.URL_SISTEMA + "/post/img/" + id;

    const formdata: FormData = new FormData();

    formdata.append('file', file);

    return this.http.post<Empresa>(url, formdata);
  }


  getEmpresa(): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado";
    return this.http.get<Empresa[]>(`${baseUrl1}`);
  }

  getEmpresaPaginado(pageIndex: number, pageSize: number): Observable<Page<Empresa>> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado/paginado";
    return this.http.get<Page<Empresa>>(`${baseUrl1}/${pageIndex}/${pageSize}`);
  }

  getSearchResult(searchword: string): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/findbysearch"
    return this.http.get<Empresa[]>(`${baseUrl1}/${searchword}`);
  }

  getSearchResultPaginado(searchword: string, pageIndex: number, pageSize: number): Observable<Page<Empresa>> {
    const baseUrl1 = this.URL_SISTEMA + "/findbysearch/paginado"
    return this.http.get<Page<Empresa>>(`${baseUrl1}/${searchword}/${pageIndex}/${pageSize}`);
  }

  enviopocket(inventario: Enviopocket[]): Observable<boolean> {
    const baseUrl1 = this.URL_SISTEMA + "/post/enviopocket";
    return this.http.post<boolean>(baseUrl1, inventario, { headers: this.cabezera });
  }

  getEmpresaListadoActivos(): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado/activos";
    return this.http.get<Empresa[]>(`${baseUrl1}`);
  }

  getEmpresaListadoActivosPaginado(pageIndex: number, pageSize: number): Observable<Page<Empresa>> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado/activos/paginado";
    return this.http.get<Page<Empresa>>(`${baseUrl1}/${pageIndex}/${pageSize}`);
  }

  getEmpresaPagina(page: number): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/page";
    return this.http.get<Empresa[]>(`${baseUrl1}/${page}`);
  }

  getEmpresaByRUC(ruc: string): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado/ruc";
    return this.http.get<Empresa[]>(`${baseUrl1}/${ruc}`);
  }

  getEmpresaByRazon(razon: string): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/listado/razon";
    return this.http.get<Empresa[]>(`${baseUrl1}/${razon}`);
  }

  getEmpresaPaginaByRUC(page: number, ruc: string): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/ruc";
    return this.http.get<Empresa[]>(`${baseUrl1}/${ruc}/${page}`);
  }

  getEmpresaPaginaByRazonSocial(page: number, razon: string): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/razonsocial";
    return this.http.get<Empresa[]>(`${baseUrl1}/${razon}/${page}`);
  }

  getEmpresaPaginaByestado(page: number): Observable<Empresa[]> {
    const baseUrl1 = this.URL_SISTEMA + "/find/estado/page";
    return this.http.get<Empresa[]>(`${baseUrl1}/${page}`);
  }

  crearEmpresa(empresa: Empresa): Observable<Empresa> {
    const baseUrl2 = this.URL_SISTEMA + "/post";
    return this.http.post<Empresa>(baseUrl2, empresa, { headers: this.cabezera });
  }

  obtenerEmpresa(id: number): Observable<Empresa> {
    const baseUrl3 = this.URL_SISTEMA + "/find/id";
    return this.http.get<Empresa>(`${baseUrl3}/${id}`);
  }

  modificarEmpresa(empresa: Empresa): Observable<Empresa> {
    const baseUrl4 = this.URL_SISTEMA + "/find/id";
    return this.http.put<Empresa>(`${baseUrl4}/${empresa.id}`, empresa, { headers: this.cabezera });
  }

  eliminarEmpresa(id: number): Observable<Empresa> {
    const baseUrl5 = this.URL_SISTEMA + "/find/id";
    return this.http.delete<Empresa>(`${baseUrl5}/${id}`);
  }

  depurarMestros(): Observable<boolean> {
    const baseUrl5 = this.URL_SISTEMA + "/delete/All";
    return this.http.delete<boolean>(`${baseUrl5}`);
  }
}