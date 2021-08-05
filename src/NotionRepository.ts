import { Client } from "@notionhq/client/build/src";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import { Page } from "@notionhq/client/build/src/api-types";
import { RequestParameters } from "@notionhq/client/build/src/Client";

export class NotionRepository {
  private notion: Client;
  constructor(authKey: string) {
    this.notion = new Client({ auth: authKey });
  }

  async getAllPageFromDatabase(databaseId: string) {
    let allPageAndUsers: Page[] = [];

    const getPages = async (cursor?: string) => {
      const requestPayload: RequestParameters = {
        path: `databases/${databaseId}/query`,
        method: "post",
        body: {},
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
        // TODO: 削除ページどうするか検討
        if (page.archived) continue;
        allPageAndUsers.push(page);
        console.log(page.url);
      }
      if (pages.has_more) {
        await getPages(pages.next_cursor ?? undefined);
      }
    };
    await getPages();
    return allPageAndUsers;
  }

  async updatePage(page: Page, updateProps: any) {
    try {
      await this.notion.pages.update({
        page_id: page.id,
        archived: false,
        properties: updateProps,
      });
      console.dir(updateProps);
    } catch (e) {
      throw e;
    }
  }
}
