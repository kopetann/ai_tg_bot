import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import {
  AddSubscriptionRequest,
  AddSubscriptionResponse,
  HasActiveSubscriptionResponse,
  SubscriptionServiceClient,
  User,
  UserRequest,
} from 'ai_tg_bot_proto';

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
    return this.subscriptionService.getUser(user).pipe(
      map((res) => {
        console.log(res);
        return res;
      }),
    );
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
