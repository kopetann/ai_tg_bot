import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { UserRequestDto } from '../dto/user.request.dto';
import { RpcException } from '@nestjs/microservices';
import {
  AddSubscriptionRequest,
  AddSubscriptionResponse,
  UserRole,
} from '../../proto/build/user.pb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public findOrCreate(findUserDto: UserRequestDto): Observable<UserEntity> {
    return this.findByExtId(findUserDto.extId).pipe(
      switchMap((res: UserEntity | null): Observable<UserEntity> => {
        if (res !== null) {
          return of(res);
        } else {
          return this.createUser({
            ...findUserDto,
            userName: findUserDto.userName ?? '',
          });
        }
      }),
    );
  }

  public findByExtId(extId: number): Observable<UserEntity | null> {
    return from(
      this.userRepository.findOne({
        where: { extId },
      }),
    );
  }

  public createUser(
    user: Pick<UserEntity, 'userName' | 'extId' | 'name'>,
  ): Observable<UserEntity> {
    const newUser: UserEntity = this.userRepository.create({ ...user });
    return from(
      this.userRepository.save(newUser).then((savedUser: UserEntity) => {
        return savedUser;
      }),
    );
  }

  public addSubscription(
    request: AddSubscriptionRequest,
  ): Observable<AddSubscriptionResponse> {
    const { userRepository } = this;
    return this.findOrCreate(request).pipe(
      switchMap(function (user: UserEntity | null) {
        if (!user) throw new RpcException(`User doesn't exist`);
        if (user.subscriptionDate) {
          throw new RpcException({
            status: 'INVALID_PARAMS',
            message: `Уважаемый ${
              user.name
            }, у Вас оформлена подписка до ${new Date(
              parseInt(user.subscriptionDate),
            ).toISOString()}`,
          });
        }
        user.subscriptionDate = request.date;
        return from(userRepository.save(user)).pipe(
          map((savedUser: UserEntity) => {
            return {
              success: true,
              message: 'Subscription added successfully',
            };
          }),
          catchError(() => {
            return of({
              success: false,
              message: 'Error updating date',
            });
          }),
        );
      }),
    );
  }

  public hasActiveSubscription(extId: number): Observable<boolean> {
    return this.findByExtId(extId).pipe(
      map((user: UserEntity | null) => {
        if (!user)
          throw new RpcException(`User with id ${extId} doesn't exist`);

        return user.subscriptionDate
          ? new Date(parseInt(user.subscriptionDate)) > new Date()
          : false;
      }),
    );
  }

  public removeRequests(
    extId: number,
    count = 1,
  ): Observable<AddSubscriptionResponse> {
    const { userRepository } = this;
    return this.findByExtId(extId).pipe(
      switchMap(function (user: UserEntity | null) {
        if (!user)
          throw new RpcException(`User with id ${extId} doesn't exist`);
        if (
          (user.subscriptionDate &&
            new Date(user.subscriptionDate) > new Date()) ||
          user.role === UserRole.admin ||
          user.freeRequests === 0
        ) {
          return of({
            success: true,
            message: 'OK',
          });
        } else {
          user.freeRequests = user.freeRequests - count;
          return from(userRepository.save(user)).pipe(
            map(() => {
              return {
                success: true,
                message: 'OK',
              };
            }),
          );
        }
      }),
    );
  }
}
