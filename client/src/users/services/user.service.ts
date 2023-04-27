import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
          throw new UnprocessableEntityException('Вы уже оформили подписку!');
        }
        return this.subscriptionService.addSubscription(request);
      }),
    );
  }

  public createPaymentButton(duration: string) {
    return Markup.inlineKeyboard([
      [Markup.button.url('Поддержка', 'https://t.me/okay_ai_chat')],
    ]);
  }

  public getSubscriptionKeyboard() {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('Неделя - 169 руб', 'week'),
        Markup.button.callback('Месяц - 359 руб', 'month'),
      ],
    ]);
  }

  public getCommonKeyboard() {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('Подписка', 'subscription'),
        Markup.button.url('Поддержка', 'https://t.me/okay_ai_chat'),
      ],
    ]);
  }

  public getSubscriptionButton(date: string) {}

  public removeFreeRequest(extId: number): Observable<AddSubscriptionResponse> {
    return this.subscriptionService.removeFreeRequest(extId);
  }

  public hasActiveSubscription(
    extId: number,
  ): Observable<HasActiveSubscriptionResponse> {
    return this.subscriptionService.hasActiveSubscription(extId);
  }
}
