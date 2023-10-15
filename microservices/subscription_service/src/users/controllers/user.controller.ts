import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UserRequestDto } from '../dto/user.request.dto';
import {
  AddSubscriptionRequest,
  AddSubscriptionResponse,
  ExtIdRequest,
  HasActiveSubscriptionResponse,
  User,
} from 'ai_tg_bot_proto';

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
