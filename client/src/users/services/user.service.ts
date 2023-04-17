import { Injectable } from '@nestjs/common';
import { GetUserInterface } from '../interfaces/get.user.interface';
import { SubscriptionService } from '../../subscription/services/subscription.serivce';
import { Observable, Subject } from 'rxjs';
import { AddSubscriptionResponse, User } from "../../proto/build/user.pb";
import { Markup } from 'telegraf';

@Injectable()
export class UserService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  public getUser(user: GetUserInterface): Observable<User> {
    const userSubject = new Subject<User>();
    this.subscriptionService.getUser(user).subscribe((res) => {
      userSubject.next(res);
    });
    return userSubject;
  }

  public getRejectTemplate(): string {
    return `К сожалению, закончилось бесплатное количество запросов 🙁 
Чтобы продолжить общение со мной, пожалуйста, оформи подписку 🙂👍"`;
  }

  public getSubscriptionKeyboard() {
    return Markup.inlineKeyboard([
      Markup.button.callback('Неделя - 169 руб', 'week'),
      Markup.button.callback('Месяц - 359 руб.', 'month'),
    ]);
  }

  public removeFreeRequest(extId: number): Observable<AddSubscriptionResponse> {
    return this.subscriptionService.removeFreeRequest(extId);
  }
}
