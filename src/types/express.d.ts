import AppUser from '../entities/user';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends AppUser {}
  }
}
