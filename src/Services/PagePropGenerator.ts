import {
  SelectOption,
  RichText,
  DatePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { KibelaMetaData, RedisRepository } from "~/Repository";
import { Config } from "../Config";

const Props = Config.Notion.Props;

interface UpdatePropertiesProp {
  [Props.AUTHOR]: SelectOption;
  [Props.CONTRIBUTORS]: SelectOption[];
  [Props.GROUPS]: SelectOption[];
  [Props.FOLDERS]: SelectOption[];
  [Props.COMMENTS]: RichText[];
  [Props.PUBLISHED_AT]: DatePropertyValue;
  [Props.UPDATED_AT]: DatePropertyValue;
  // [Props.PUBLISHED_AT]: Omit<DatePropertyValue, "id">;
  // [Props.UPDATED_AT]: Omit<DatePropertyValue, "id">;
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

  // #makeDatePropertyValue(id: string, isoString: string): Omit<DatePropertyValue, "id"> {
  #makeDatePropertyValue(id: string, isoString: string): DatePropertyValue {
    return {
      id,
      type: "date",
      date: {
        start: isoString,
      },
    };
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
    // const publishedAt = this.#makeDatePropertyValue(this.content.published_at);
    // const updatedAt = this.#makeDatePropertyValue(this.content.updated_at);
    // const publishedAt = this.#makeDatePropertyValue(
    //   this.content.published_at
    // );
    // const updatedAt = this.#makeDatePropertyValue(
    //   this.content.updated_at
    // );

    return {
      [Props.AUTHOR]: author,
      [Props.CONTRIBUTORS]: contributors,
      [Props.FOLDERS]: folders,
      [Props.GROUPS]: groups,
      [Props.COMMENTS]: this.#getComments(),
      [Props.PUBLISHED_AT]: publishedAt,
      [Props.UPDATED_AT]: updatedAt,
    };
  }
}
