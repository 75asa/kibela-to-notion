import { Client } from "@notionhq/client/build/src";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import { Page } from "@notionhq/client/build/src/api-types";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { RedisRepository } from "./RedisRepository";

export class NotionRepository {
  private notion: Client;
  constructor(authKey: string) {
    this.notion = new Client({ auth: authKey });
  }

  async getAllPageFromDatabase(databaseId: string, prefixNumbers: number[]) {
    let allPages: Page[] = [];

    const getPages = async (cursor?: string) => {
      const requestPayload: RequestParameters = {
        path: `databases/${databaseId}/query`,
        method: "post",
        body: {
          filter: {
            or: prefixNumbers.map(prefix => {
              return {
                property: "Name",
                text: {
                  starts_with: `${String(prefix)}-`,
                },
              };
            }),
          },
        },
      };
      if (cursor) requestPayload.body = { start_cursor: cursor };
      let pages = null;
      try {
        pages = (await this.notion.request(
          requestPayload
        )) as DatabasesQueryResponse;
      } catch (e) {
        throw e;
      }

      for (const page of pages.results) {
        if (page.archived) continue;
        allPages.push(page);
        console.log(page.url);
      }
      if (pages.has_more) {
        await getPages(pages.next_cursor ?? undefined);
      }
    };
    await getPages();
    return allPages;
  }

  async updatePage(page: Page, updateProps: any, redisRepo: RedisRepository) {
    let updatedPage;
    try {
      updatedPage = await this.notion.pages.update({
        page_id: page.id,
        archived: false,
        properties: updateProps,
      });
    } catch (e) {
      throw e;
    }
    const ignorePropNames = ["Name", "comments"];

    for (const propKey in updatedPage.properties) {
      console.log({ propKey });
      if (ignorePropNames.includes(propKey)) continue;
      const propValue = updatedPage.properties[propKey];
      if (propValue.type === "select") {
        const { id, name } = propValue.select;
        await redisRepo.sadd(`${propKey}:${name!}`, id!);
        continue;
      }
      if (propValue.type !== "multi_select") continue;
      for await (const menu of propValue.multi_select) {
        const { id, name } = menu;
        await redisRepo.sadd(`${propKey}:${name!}`, id!);
      }
    }
    console.dir({ updatedPage }, { depth: null });
  }
}
