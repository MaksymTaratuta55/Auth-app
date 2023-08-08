import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import { InvalidRefreshTokenError } from '../invalid-refresh-token-error/invalid-refresh-token-error';

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  onApplicationBootstrap() {
    // TODO: Ideally, we should move this to the dedicated "RedisModule"
    // instead of initiating the connection here.
    this.redisClient = new Redis({
      host: 'localhost', // NOTE: According to best practices, we should use the environment variables here instead.
      port: 6379, // 👆
    });
  }

  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  async insert(userId: number, tokenId: string) {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storeId = await this.redisClient.get(this.getKey(userId));

    if (storeId === null) {
      throw new InvalidRefreshTokenError();
    }

    return storeId === tokenId;
  }

  async invalidate(userId: number) {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
