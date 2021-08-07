import IORedis from "ioredis";

export class RedisRepository {
  private redis: IORedis.Redis;

  constructor(options?: IORedis.RedisOptions) {
    this.redis = new IORedis(options);
  }

  async echo(message: string) {
    return await this.redis.echo(message);
  }

  async set(key: string, value: string) {
    return await this.redis.set(key, value);
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
