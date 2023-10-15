import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable, of, switchMap, take } from 'rxjs';
import { UserService } from '../../users/services/user.service';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { User, UserRole } from 'ai_tg_bot_proto';

export class UserHasLimitGuard implements CanActivate {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const updateCtx: TelegrafExecutionContext =
      TelegrafExecutionContext.create(context);
    const fullCtx: Context = updateCtx.getContext<Context>();

    return this.userService
      .getUser({
        extId: fullCtx.from.id,
        userName: fullCtx.from.username ?? '',
        name: fullCtx.from.first_name,
      })
      .pipe(
        take(1),
        switchMap((user: User): Observable<boolean> => {
          if (
            Object.keys(UserRole)[user.role] !== 'admin' &&
            ((user.freeRequests < 1 && !user.subscriptionDate) ||
              (user.subscriptionDate &&
                new Date(parseInt(user.subscriptionDate)) < new Date()))
          ) {
            fullCtx
              .reply(
                this.userService.getRejectTemplate(),
                this.userService.getSubscriptionKeyboard(),
              )
              .then((r) => r.text);
            return of(false);
          }
          return of(true);
        }),
      );
  }
}
