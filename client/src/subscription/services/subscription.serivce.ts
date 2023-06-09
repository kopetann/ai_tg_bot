import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { SubscriptionServiceClient } from '../../proto/build/subscription_service.pb';
import {
  AddSubscriptionRequest,
  AddSubscriptionResponse,
  HasActiveSubscriptionResponse,
  User,
  UserRequest,
} from '../../proto/build/user.pb';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  private subscriptionService: SubscriptionServiceClient;

  constructor(
    @Inject('SUBSCRIPTION_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.subscriptionService = this.client.getService('SubscriptionService');
  }

  public getUser(user: UserRequest): Observable<User> {
    return this.subscriptionService.getUser(user);
  }

  public removeFreeRequest(extId: number): Observable<AddSubscriptionResponse> {
    return this.subscriptionService.removeOneFreeRequest({ extId });
  }

  public addSubscription(
    request: AddSubscriptionRequest,
  ): Observable<AddSubscriptionResponse> {
    return this.subscriptionService.addSubscription(request);
  }

  public hasActiveSubscription(
    extId: number,
  ): Observable<HasActiveSubscriptionResponse> {
    return this.subscriptionService.hasActiveSubscription({ extId });
  }
}
