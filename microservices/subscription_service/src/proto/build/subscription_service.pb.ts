/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import {
  AddSubscriptionRequest,
  AddSubscriptionResponse,
  ExtIdRequest,
  HasActiveSubscriptionResponse,
  User,
  UserRequest,
} from "./user.pb";

export const protobufPackage = "subscription_service";

export const SUBSCRIPTION_SERVICE_PACKAGE_NAME = "subscription_service";

export interface SubscriptionServiceClient {
  getUser(request: UserRequest, ...rest: any): Observable<User>;

  hasActiveSubscription(request: User, ...rest: any): Observable<HasActiveSubscriptionResponse>;

  addSubscription(request: AddSubscriptionRequest, ...rest: any): Observable<AddSubscriptionResponse>;

  addPaidRequests(request: User, ...rest: any): Observable<AddSubscriptionResponse>;

  removeOneFreeRequest(request: ExtIdRequest, ...rest: any): Observable<AddSubscriptionResponse>;
}

export interface SubscriptionServiceController {
  getUser(request: UserRequest, ...rest: any): Observable<User>;

  hasActiveSubscription(request: User, ...rest: any): Observable<HasActiveSubscriptionResponse>;

  addSubscription(request: AddSubscriptionRequest, ...rest: any): Observable<AddSubscriptionResponse>;

  addPaidRequests(request: User, ...rest: any): Observable<AddSubscriptionResponse>;

  removeOneFreeRequest(request: ExtIdRequest, ...rest: any): Observable<AddSubscriptionResponse>;
}

export function SubscriptionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUser",
      "hasActiveSubscription",
      "addSubscription",
      "addPaidRequests",
      "removeOneFreeRequest",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SubscriptionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SubscriptionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SUBSCRIPTION_SERVICE_NAME = "SubscriptionService";
