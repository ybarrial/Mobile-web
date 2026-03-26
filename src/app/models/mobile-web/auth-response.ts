export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;

    user_name: string;
    password: string; // viene en la respuesta, aunque en general no es buena práctica devolverla
    enabled: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;

    nombre: string;
    authorities: string[]; // depende de cómo venga el JSON desde Java
}