import {
  MarkdownRepository,
  RedisRepository,
  NotionRepository,
  KibelaMetaData,
} from "~/Repository";
import { PageFilter, PageTag, PropStore } from "~/UseCases";

interface TaggerResult {
  notesPath: string;
  totalAmount: number;
  updating: {
    successCount: number;
  };
  storing: {
    successCount: number;
  };
}

interface TaggerArgs {
  markdownRepo: MarkdownRepository;
  redisRepo: RedisRepository;
  notionRepo: NotionRepository;
}

export class Tagger {
  #redisRepo: RedisRepository;
  #notionRepo: NotionRepository;
  #allMetaData: {
    prefixNumber: number;
    meta: KibelaMetaData;
  }[];
  #result: TaggerResult;
  private constructor({ markdownRepo, redisRepo, notionRepo }: TaggerArgs) {
    this.#notionRepo = notionRepo;
    this.#redisRepo = redisRepo;
    this.#allMetaData = [];
    this.#result = {
      notesPath: markdownRepo.getNotesPath(),
      totalAmount: 0,
      updating: {
        successCount: 0,
      },
      storing: {
        successCount: 0,
      },
    };
  }

  static async factory({ markdownRepo, redisRepo, notionRepo }: TaggerArgs) {
    const instance = new Tagger({
      markdownRepo,
      redisRepo,
      notionRepo,
    });
    instance.#allMetaData = await markdownRepo.getAllMeta();
    return instance;
  }

  async run() {
    const filteredPages = await new PageFilter(this.#allMetaData).invoke(
      this.#notionRepo
    );

    this.#result.totalAmount = filteredPages.length;

    for await (const page of filteredPages) {
      const updatedPage = await new PageTag({
        page,
        allMetaData: this.#allMetaData,
        redisRepo: this.#redisRepo,
        notionRepo: this.#notionRepo,
      }).invoke();
      if (!updatedPage) continue;
      this.#result.updating.successCount++;
      await new PropStore({
        propValueMap: updatedPage.properties,
        redisRepo: this.#redisRepo,
      }).invoke();
      this.#result.storing.successCount++;
    }

    return this.#result;
  }
}
