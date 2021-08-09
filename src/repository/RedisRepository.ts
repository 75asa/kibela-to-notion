import IORedis from "ioredis";

export class RedisRepository {
  private redis: IORedis.Redis;

  constructor(options?: IORedis.RedisOptions) {
    this.redis = new IORedis(options);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async sadd(key: string, value: string) {
    try {
      await this.redis.sadd(key, value);
    } catch (e) {
      throw e;
    }
  }
}
