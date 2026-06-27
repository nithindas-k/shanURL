import { UserModel, IUser } from '../models/user.model';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async create(email: string, hashedPassword: string): Promise<IUser> {
    return UserModel.create({ email, password: hashedPassword });
  }
}
