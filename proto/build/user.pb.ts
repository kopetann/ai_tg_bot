/* eslint-disable */
import { Timestamp } from "./google/protobuf/timestamp.pb";

export const protobufPackage = "user";

export enum UserRole {
  admin = "admin",
  user = "user",
}

export interface User {
  id: string;
  createdAt?: Timestamp | undefined;
  deletedAt?: Timestamp | undefined;
  updatedAt?: Timestamp | undefined;
  extId: number;
  name: string;
  freeRequests: number;
  role: UserRole;
  userName?: string | undefined;
  subscriptionDate?: string | undefined;
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
  name: string;
  userName?: string | undefined;
  date: string;
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
