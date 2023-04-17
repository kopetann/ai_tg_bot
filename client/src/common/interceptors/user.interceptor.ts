import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, take } from 'rxjs';
import { UserService } from '../../users/services/user.service';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { User } from '../../proto/build/user.pb';

export class UserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}
  intercept(context: ExecutionContext, _: CallHandler<any>): Observable<User> {
    const ctx: TelegrafExecutionContext =
      TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();
    return this.userService
      .getUser({
        userName: from.username ?? '',
        name: from.first_name,
        extId: from.id,
      })
      .pipe(take(1));
  }
}
