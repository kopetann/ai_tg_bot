import { Injectable } from '@nestjs/common';
import { config } from '../../common/config';
import { HttpService } from '@nestjs/axios';
import { PaymentDto } from '../dto/payment.dto';
import { UserService } from '../../users/services/user.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { PaymentResponseInterface } from '../interfaces/payment.response.interface';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { HasActiveSubscriptionResponse } from 'ai_tg_bot_proto';

@Injectable()
export class PaymentService {
  protected url = config.get<string>(
    'YOOKASSA_API_ENDPOINT',
    'https://api.yookassa.ru/v3/',
  );

  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    @InjectBot() private readonly bot: Telegraf,
  ) {}

  public createPayment(
    paymentDto: PaymentDto,
  ): Observable<PaymentResponseInterface> {
    return this.userService
      .hasActiveSubscription(paymentDto.metadata.user_id)
      .pipe(
        switchMap((hasActiveSubscription: HasActiveSubscriptionResponse) => {
          if (hasActiveSubscription.isActive) {
            throw new RpcException('У Вас уже есть подписка!');
          }
          return this.httpService
            .post(
              `${this.url}payments`,
              this.returnPaymentCredentials(paymentDto),
              {
                auth: {
                  username: config.get('YOOKASSA_SHOP_ID'),
                  password: config.get('YOOKASSA_SECRET'),
                },
                headers: {
                  'Content-Type': 'application/json',
                  'Idempotence-Key': Math.random() * 100,
                },
              },
            )
            .pipe(
              map((res) => {
                return res.data;
              }),
            );
        }),
      );
  }

  public checkForStatusUpdate(paymentId: string, attempt = 0) {
    this.httpService
      .get(this.url + `payments/${paymentId}`, {
        auth: {
          username: config.get('YOOKASSA_SHOP_ID'),
          password: config.get('YOOKASSA_SECRET'),
        },
      })
      .pipe(
        switchMap((res) => {
          if (attempt > 50) {
            this.bot.telegram.sendMessage(
              res.data.metadata.user_id,
              'Ошибка во время проведения оплаты!',
            );
            return of(0);
          }
          if (res.data.status === 'pending') {
            setTimeout(
              () => this.checkForStatusUpdate(paymentId, attempt + 1),
              10000,
            );
          } else if (res.data.status === 'succeeded') {
            return this.userService
              .addSubscription({
                extId: res.data.metadata.user_id,
                date: res.data.metadata.date,
                name: res.data.metadata.name,
                userName: res.data.metadata.user_name ?? '',
              })
              .pipe((response) => {
                this.bot.telegram.sendMessage(
                  res.data.metadata.user_id,
                  'Отлично, спасибо, за подписку!\n' +
                    '\n' +
                    'Теперь мы можем:\n' +
                    '\n' +
                    '  \n' +
                    '\n' +
                    '🌟Общаться без ограничений и лимитов\n' +
                    '\n' +
                    '⏳Доступ к общению 24/7\n' +
                    '\n' +
                    '🤓Запоминать контекст разговора\n' +
                    '\n' +
                    '🧑‍💻Решить все технические вопросы при возникновении\n' +
                    '\n' +
                    '  \n' +
                    '\n' +
                    'Задай мне любой вопрос 🙂👍',
                  this.userService.getCommonKeyboard(),
                );
                return response;
              });
          }
          return of(res.data);
        }),
      )
      .subscribe();
  }

  private returnPaymentCredentials(paymentDto: PaymentDto) {
    return {
      amount: {
        value: '',
        currency: 'RUB',
      },
      capture: true,
      description: `Оплата подписки в сервисе ${config.get(
        'BOT_NAME',
        'OkayAI',
      )}`,
      metadata: {
        user_id: '',
      },
      confirmation: {
        type: 'redirect',
        return_url: config.get<string>('BOT_URL'),
      },
      ...paymentDto,
    };
  }
}
