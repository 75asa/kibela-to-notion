import IORedis from "ioredis";

export class RedisRepository {
  private redis: IORedis.Redis;

  constructor(options?: IORedis.RedisOptions) {
    this.redis = new IORedis(options);
  }

  async getKey(key: string) {
    let storedKey;
    try {
      storedKey = await this.redis.get(key);
      // console.log({ storedKey });
    } catch (e) {
      console.error({ key });
      throw e;
    }

    return storedKey;
  }

  async set(key: string, value: string) {
    try {
      await this.redis.set(key, value).then(data => console.log({ data }));
    } catch (e) {
      throw e;
    }
  }
}
