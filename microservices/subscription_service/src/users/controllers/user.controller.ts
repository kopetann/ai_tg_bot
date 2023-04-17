import { Controller } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UserRequestDto } from '../dto/user.request.dto';
import { AddSubscriptionResponseInterface } from '../interfaces/add.subscription.response.interface';
import {
  AddSubscriptionRequest,
  AddSubscriptionResponse,
  ExtIdRequest,
  User,
} from '../../proto/build/user.pb';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('SubscriptionService', 'GetUser')
  public getUser(user: UserRequestDto): Observable<User> {
    // @ts-ignore
    return this.userService.findOrCreate(user).pipe(tap((res) => {}));
  }

  @GrpcMethod('SubscriptionService', 'HasActiveSubscription')
  public hasActiveSubscription(user: UserRequestDto): Observable<boolean> {
    return this.userService.hasActiveSubscription(user.extId);
  }

  @GrpcMethod('SubscriptionService', 'AddSubscription')
  public addSubscription(
    addSubscriptionRequest: AddSubscriptionRequest,
  ): Observable<AddSubscriptionResponse> {
    return this.userService.addSubscription(addSubscriptionRequest);
  }

  @GrpcMethod('SubscriptionService', 'RemoveOneFreeRequest')
  public removeRequest(
    user: UserRequestDto,
  ): Observable<AddSubscriptionResponse> {
    return this.userService.removeRequests(user.extId);
  }
}
