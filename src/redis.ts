import { Config } from "./Config";
import { RedisRepository } from "./repository/RedisRepository";

const redisRepo = new RedisRepository({
  showFriendlyErrorStack: Config.Redis.SHOW_FRIENDLY_ERROR_STACK,
});

const main = async () => {
  await redisRepo.sadd("NIPPP", " NI / PPP");
  process.exit();
};

main();
