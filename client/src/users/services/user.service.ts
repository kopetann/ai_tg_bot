import { Injectable } from '@nestjs/common';
import { GetUserInterface } from '../interfaces/get.user.interface';
import { catchError, Observable, of, switchMap } from 'rxjs';
import {
  AddSubscriptionRequest,
  AddSubscriptionResponse,
  HasActiveSubscriptionResponse,
  User,
} from '../../proto/build/user.pb';
import { Markup } from 'telegraf';
import { SubscriptionService } from '../../subscription/services/subscription.serivce';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  public getUser(user: GetUserInterface): Observable<User> {
    return this.subscriptionService.getUser(user);
  }

  public getRejectTemplate(): string {
    return `К сожалению, закончилось бесплатное количество запросов 🙁\nЧтобы продолжить общение со мной, пожалуйста, оформи подписку 🙂👍`;
  }

  public addSubscription(
    request: AddSubscriptionRequest,
  ): Observable<AddSubscriptionResponse> {
    return this.subscriptionService.hasActiveSubscription(request.extId).pipe(
      catchError((err) => {
        console.error(err);
        return of();
      }),
      switchMap((hasActiveSubscription) => {
        if (hasActiveSubscription.isActive) {
          throw new RpcException('Вы уже оформили подписку!');
        }
        return this.subscriptionService.addSubscription(request);
      }),
    );
  }

  public getSubscriptionKeyboard() {
    return Markup.keyboard([
      [
        Markup.button.callback('Неделя - 169 руб', 'week'),
        Markup.button.callback('Месяц - 359 руб.', 'month'),
      ],
    ]);
  }

  public removeFreeRequest(extId: number): Observable<AddSubscriptionResponse> {
    return this.subscriptionService.removeFreeRequest(extId);
  }

  public hasActiveSubscription(
    extId: number,
  ): Observable<HasActiveSubscriptionResponse> {
    return this.subscriptionService.hasActiveSubscription(extId);
  }
}
