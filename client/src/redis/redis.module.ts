import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { config } from '../common/config';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: config.get<string>('REDIS_HOST', 'redis'),
            port: config.get<number>('REDIS_PORT', 6380),
          },
          ttl: config.get<number>('REDIS_TTL', 60),
        }),
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
