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
    try {
      const updatedPage = await this.notion.pages.update({
        page_id: page.id,
        archived: false,
        properties: updateProps,
      });
      // update 後の page を取得
      // page.properties を回して Name 以外の prop value を取得
      // redis に Value と ID を書き込む
      // updateProp.ts で まず name から prop の ID があるか調べる
      // ある場合は ID　で、ない場合は name で指定し、更新後に redis に登録
      const ignorePropNames = ["Name", "comments", "contributors", "author"];
      for (const propKey in updatedPage.properties) {
        if (ignorePropNames.includes(propKey)) continue;
        const propValue = updatedPage.properties[propKey];
        if (propValue.type !== "multi_select") continue;
        for (const menu of propValue.multi_select) {
          const name = menu.name!;
          const id = menu.id!;
          await redisRepo.sadd(`${propKey}:${name}`, id);
        }
      }
      console.dir(updateProps);
    } catch (e) {
      throw e;
    }
  }
}
