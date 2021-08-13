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
      console.log({ storedKey });
    } catch (e) {
      throw new Error(`Error getting key ${key} from redis`);
    }

    return storedKey;
  }

  async sadd(key: string, value: string) {
    try {
      await this.redis.sadd(key, value).then(data => console.log({ data }));
    } catch (e) {
      throw e;
    }
  }
}
