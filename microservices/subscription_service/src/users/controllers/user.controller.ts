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
  HasActiveSubscriptionResponse,
  User,
} from '../../proto/build/user.pb';
import { log } from '@grpc/grpc-js/build/src/logging';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('SubscriptionService', 'GetUser')
  public getUser(user: UserRequestDto): Observable<User> {
    return this.userService.findOrCreate(user);
  }

  @GrpcMethod('SubscriptionService', 'HasActiveSubscription')
  public hasActiveSubscription(
    user: ExtIdRequest,
  ): Observable<HasActiveSubscriptionResponse> {
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
    extIdRequest: ExtIdRequest,
  ): Observable<AddSubscriptionResponse> {
    return this.userService.removeRequests(extIdRequest.extId);
  }
}
