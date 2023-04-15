import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, Observable, of, tap } from "rxjs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findByLogin(userName: string): Promise<Observable<User>> {
    const user = await this.userRepository.findOne({
      where: { userName },
    });
    if (!user) {
      return this.createUser({ userName });
    }
    return of(user);
  }

  public createUser(user: Pick<User, 'userName'>): Observable<User> {
    const newUser = this.userRepository.create({ ...user });
    return from(this.userRepository.save(newUser)).pipe(
      tap((savedUser) => {
        return savedUser;
      }),
    );
  }

  public async getBalance(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }
}
