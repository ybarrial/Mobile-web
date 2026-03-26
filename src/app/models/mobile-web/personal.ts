import { Cargo } from "./cargo";


export class Personal {
    id?: number;
    apellidopaterno?: string;
    apellidomaterno?: string;
    nombre?: string;
    codcargo?: string;
    estado?: boolean;
    codempresa?: number;
    inv?: string;
    docidentidad?: string;
    codtipodoc?: string;
    correo?: string;
    foto?: string;
    domicilio?: string;
    refdomicio?: string;
    fecnacimiento?: string;
    fecreacion?: string;
    fecmodificacion?: string;
    codusuariocreacion?: string;
    codusuariomodificacion?: string;
    codtipopersona?: string;
    cargo?: Cargo;
    imagen?: string;
}
