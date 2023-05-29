import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public get<T>(key: string): Promise<T> {
    return this.cacheManager.get<T>(key);
  }

  public set(key: string, value: any): Promise<void> {
    return this.cacheManager.set(key, value);
  }

  public del(key: string): Promise<void> {
    return this.cacheManager.del(key);
  }
}
