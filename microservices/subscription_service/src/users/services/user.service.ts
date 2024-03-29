import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { UserRequestDto } from '../dto/user.request.dto';
import { RpcException } from '@nestjs/microservices';
import {
  AddSubscriptionRequest,
  AddSubscriptionResponse,
  HasActiveSubscriptionResponse,
  UserRole,
} from 'ai_tg_bot_proto';

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

  public hasActiveSubscription(
    extId: number,
  ): Observable<HasActiveSubscriptionResponse> {
    return this.findByExtId(extId).pipe(
      map((user: UserEntity | null) => {
        if (!user)
          throw new RpcException(`User with id ${extId} doesn't exist`);

        return {
          isActive: user.subscriptionDate
            ? new Date(parseInt(user.subscriptionDate)) > new Date()
            : false,
        };
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
            new Date(parseInt(user.subscriptionDate)) < new Date()) ||
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
