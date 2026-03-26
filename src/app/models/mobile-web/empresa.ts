export class Empresa {
  id: number;
  codigoruc?: string;
  nomempresa?: string;
  razonsocial?: string;
  nomcomercial?: string;
  indbaja?: Boolean;
  fechabaja?: string;
  feccreacion?: string;
  principal?: Boolean;
  codempresasup?: number;
  imagen?: string;

  constructor(id: number) {
    this.id = id;
  }
}
