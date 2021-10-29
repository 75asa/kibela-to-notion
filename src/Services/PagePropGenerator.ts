import {
  SelectOption,
  RichText,
  DatePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { KibelaMetaData, RedisRepository } from "~/Repository";
import { Config } from "../Config";
import { parseISO8601FromKibelaFormatDate } from "../Utils";

const Props = Config.Notion.Props;

interface UpdatePropertiesProp {
  [Props.AUTHOR]: { select: SelectOption };
  [Props.CONTRIBUTORS]: { multi_select: SelectOption[] };
  [Props.GROUPS]: { multi_select: SelectOption[] };
  [Props.FOLDERS]: { multi_select: SelectOption[] };
  [Props.COMMENTS]: { rich_text: RichText[] };
  [Props.PUBLISHED_AT]: Omit<DatePropertyValue, "id">;
  [Props.UPDATED_AT]: Omit<DatePropertyValue, "id">;
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

  #makeDatePropertyValue(kibelaFormatDate: string): Omit<DatePropertyValue, "id"> {
    return {
      type: "date",
      date: {
        start: parseISO8601FromKibelaFormatDate(kibelaFormatDate),
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
    const publishedAt = this.#makeDatePropertyValue(this.content.published_at);
    const updatedAt = this.#makeDatePropertyValue(this.content.updated_at);
    const comments = this.#getComments();

    return {
      [Props.AUTHOR]: { select: author },
      [Props.CONTRIBUTORS]: { multi_select: contributors },
      [Props.FOLDERS]: { multi_select: folders },
      [Props.GROUPS]: { multi_select: groups },
      [Props.COMMENTS]: { rich_text: comments },
      [Props.PUBLISHED_AT]: publishedAt,
      [Props.UPDATED_AT]: updatedAt,
    };
  }
}
