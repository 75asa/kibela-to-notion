import { SelectOption, RichText } from "@notionhq/client/build/src/api-types";
import { Config } from "../Config";
import { KibelaMetaData } from "../Repository/MarkdownRepository";
import { RedisRepository } from "../Repository/RedisRepository";

const Props = Config.Notion.Props;

interface UpdatePropertiesProp {
  [Props.AUTHOR]: SelectOption;
  [Props.CONTRIBUTORS]: SelectOption[];
  [Props.GROUPS]: SelectOption[];
  [Props.FOLDERS]: SelectOption[];
  [Props.COMMENTS]: RichText[];
}

export class PagePropGenerator {
  constructor(
    private content: KibelaMetaData,
    private redisRepo: RedisRepository
  ) {}
  async #getIdOrNameFromArray<T extends any[]>(key: string, array: T) {
    return await Promise.all(
      array.map(async name => {
        const id = await this.redisRepo.getKey(`${key}:${name}`);
        if (!id) return { name };
        return { id };
      })
    );
  }
  async #getIdOrNameFromString(key: string, value: string) {
    return await this.redisRepo.getKey(`${key}:${value}`).then(id => {
      if (!id) return { name: this.content.author };
      return { id };
    });
  }

  #getComments(): RichText[] {
    return this.content.comments.map(comment => {
      const author = comment.author;
      const content = comment.content;
      const text = `${author}: ${content}`;
      return {
        type: "text",
        plain_text: text,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: "default",
        },
        text: {
          content: `${text}\n`,
        },
      };
    });
  }

  async invoke(): Promise<UpdatePropertiesProp> {
    const folders = await this.#getIdOrNameFromArray(
      "folders",
      this.content.folders
    );
    const groups = await this.#getIdOrNameFromArray(
      "groups",
      this.content.groups
    );
    const author = await this.#getIdOrNameFromString(
      "author",
      this.content.author
    );
    const contributors = await this.#getIdOrNameFromArray(
      "contributors",
      this.content.contributors
    );
    return {
      [Props.AUTHOR]: author,
      [Props.CONTRIBUTORS]: contributors,
      [Props.FOLDERS]: folders,
      [Props.GROUPS]: groups,
      [Props.COMMENTS]: this.#getComments(),
    };
  }
}
