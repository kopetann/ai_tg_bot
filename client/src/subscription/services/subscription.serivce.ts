import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { GetUserInterface } from '../../users/interfaces/get.user.interface';
import { UserResponseInterface } from '../../users/interfaces/user.response.interface';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  private subscriptionService;

  constructor(
    @Inject('SUBSCRIPTION_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): any {
    this.subscriptionService = this.client.getService('SubscriptionService');
  }

  public getUser(user: GetUserInterface): Observable<UserResponseInterface> {
    return this.subscriptionService.getUser(user);
  }
}
