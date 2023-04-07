import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getBalance(userId: string): Promise<number> {
    return this.userRepository
      .findOne({
        where: { id: userId },
      })
      .then((res) => res.balance);
  }
}
