export interface UserInfo {
  id?: number; // Facultatif car il est généré automatiquement
  name: string;
  email: string;
  password: string;
  roles: string; // Chaîne contenant les rôles (par exemple, "USER,ADMIN")
}
