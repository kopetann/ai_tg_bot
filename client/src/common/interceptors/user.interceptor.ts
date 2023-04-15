import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { UserService } from '../../users/services/user.service';
import { UpdateInterface } from '../../bot/interfaces/update.interface';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request: UpdateInterface = context.switchToHttp().getRequest().update;

    context.switchToHttp().getRequest().user = await this.userService.getUser({
      userName: 'yetAnotherFeature',
    });
    return next.handle().pipe(
      tap(() => {
        return request.user;
      }),
    );
  }
}
