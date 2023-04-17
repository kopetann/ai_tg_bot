/* eslint-disable */
import { Duration } from "./google/protobuf/duration.pb";
import { Timestamp } from "./google/protobuf/timestamp.pb";

export const protobufPackage = "user";

export enum UserRole {
  admin = "admin",
  user = "user",
}

export interface User {
  id: string;
  extId: number;
  name: string;
  freeRequests: number;
  role: UserRole;
  userName?: string | undefined;
  requestCount?: number | undefined;
  subscriptionDate?: number | undefined;
}

export interface HasActiveSubscriptionResponse {
  isActive: boolean;
}

export interface UserRequest {
  extId: number;
  name: string;
  userName?: string | undefined;
}

export interface ExtIdRequest {
  extId: number;
}

export interface AddSubscriptionRequest {
  extId: number;
  date: number;
}

export interface AddPaidRequest {
  extId: number;
  requestsNumber: number;
}

export interface AddSubscriptionResponse {
  success: boolean;
  message: string;
}

export const USER_PACKAGE_NAME = "user";
