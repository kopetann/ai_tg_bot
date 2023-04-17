import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { SubscriptionServiceClient } from '../../proto/build/subscription_service.pb';
import {
  AddSubscriptionResponse,
  User,
  UserRequest,
} from '../../proto/build/user.pb';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  private subscriptionService: SubscriptionServiceClient;

  constructor(
    @Inject('SUBSCRIPTION_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): any {
    this.subscriptionService = this.client.getService('SubscriptionService');
  }

  public getUser(user: UserRequest): Observable<User> {
    return this.subscriptionService.getUser(user);
  }

  public removeFreeRequest(extId: number): Observable<AddSubscriptionResponse> {
    return this.subscriptionService.removeOneFreeRequest({ extId });
  }
}
