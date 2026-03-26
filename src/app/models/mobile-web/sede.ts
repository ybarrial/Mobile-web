import { Empresa } from "./empresa";

export class Sede {
  codsede?: string;
  empresa?: Empresa;
  codempresa?: number;
  descripcion?: string;
  feccreacion?: string;
  estado?: boolean;
  seleccionada?: boolean;

  constructor(codsede?: string, descripcion?: string, codempresa?: number) {
    this.codsede = codsede || '';
    this.descripcion = descripcion || '';
    this.codempresa = codempresa;
  }
}
