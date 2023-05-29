export interface RolesInterface {
  role: Roles;
  content: string;
}

export enum Roles {
  system = 'system',
  user = 'user',
}
