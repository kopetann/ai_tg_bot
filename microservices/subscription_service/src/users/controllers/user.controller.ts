import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UserRequestDto } from '../dto/user.request.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('SubscriptionService', 'GetUser')
  public getUser(user: UserRequestDto): Promise<Observable<User>> {
    return this.userService.findByLogin(user.userName);
  }
}
