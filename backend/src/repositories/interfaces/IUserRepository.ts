import { IUser } from '../../models/user.model';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(email: string, hashedPassword: string): Promise<IUser>;
}
