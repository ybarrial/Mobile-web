export class Usuario {
    usuario?: string;
    nombre?: string;
    password?: string;
    perfil?: number;
    estado?: boolean;
    syncccostos?: boolean | string;
    synctiplanilla?: boolean | string;
    syncareaas?: boolean | string;
    roles: string[] = [];
    codusuariosup?: string;
    codpersonal?: number;
    imagen?: string;
}
