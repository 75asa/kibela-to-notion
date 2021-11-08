import { PropertyValueMap } from "@notionhq/client/build/src/api-endpoints";
import { Config } from "~/Config";
import { RedisRepository } from "~/Repository";

const { NAME, COMMENTS, PREFIX_NUMBER } = Config.Notion.Props;

interface PropStoreArgs {
  propValueMap: PropertyValueMap;
  redisRepo: RedisRepository;
}
export class PropStore {
  #propValueMap: PropertyValueMap;
  #redisRepo: RedisRepository;
  #IGNORE_PROP_NAMES = [NAME, COMMENTS, PREFIX_NUMBER];
  constructor({ propValueMap, redisRepo }: PropStoreArgs) {
    this.#propValueMap = propValueMap;
    this.#redisRepo = redisRepo;
  }

  async invoke() {
    for (const propKey in this.#propValueMap) {
      if (this.#IGNORE_PROP_NAMES.includes(propKey)) continue;
      const propValue = this.#propValueMap[propKey];
      if (propValue.type === "select") {
        const { id, name } = propValue.select;
        const key = `${propKey}:${name!}`;
        if (await this.#redisRepo.getKey(key)) continue;
        await this.#redisRepo.set(key, id!);
        continue;
      }
      if (propValue.type !== "multi_select") continue;
      for await (const menu of propValue.multi_select) {
        const { id, name } = menu;
        const key = `${propKey}:${name!}`;
        if (await this.#redisRepo.getKey(key)) continue;
        await this.#redisRepo.set(key, id!);
        continue;
      }
    }
  }
}
