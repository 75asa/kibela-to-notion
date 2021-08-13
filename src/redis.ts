import { Config } from "./Config";
import { RedisRepository } from "./repository/RedisRepository";

const redisRepo = new RedisRepository({
  showFriendlyErrorStack: Config.Redis.SHOW_FRIENDLY_ERROR_STACK,
});

const main = async () => {
  await redisRepo.set('folders:日報 \/ 日報', '993939-1820fl2-92');
  const key = await redisRepo.getKey("folders:日報 \/ 日報");
  console.log({ key });
  process.exit();
};

main();
