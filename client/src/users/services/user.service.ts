import { Injectable } from '@nestjs/common';
import { GetUserInterface } from '../interfaces/get.user.interface';
import { SubscriptionService } from '../../subscription/services/subscription.serivce';
import { Observable, Subject } from 'rxjs';
import { UserResponseInterface } from '../interfaces/user.response.interface';

@Injectable()
export class UserService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  public getUser(user: GetUserInterface): Observable<UserResponseInterface> {
    const userSubject = new Subject<UserResponseInterface>();
    console.log(user);
    this.subscriptionService.getUser(user).subscribe((res) => {
      userSubject.next(res);
    });
    return userSubject;
  }
}
