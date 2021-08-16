import { SelectOption, RichText } from "@notionhq/client/build/src/api-types";
import { Config } from "./Config";
import { KibelaMetaData } from "./metaParser";
import { RedisRepository } from "./repository/RedisRepository";

interface UpdatePropertiesProp {
  [Config.Notion.Props.AUTHOR]: SelectOption;
  [Config.Notion.Props.CONTRIBUTORS]: SelectOption[];
  [Config.Notion.Props.GROUPS]: SelectOption[];
  [Config.Notion.Props.FOLDERS]: SelectOption[];
  [Config.Notion.Props.COMMENTS]: RichText[];
}

export const getProps = async (updateArg: {
  content: KibelaMetaData;
  redisRepo: RedisRepository;
}): Promise<UpdatePropertiesProp> => {
  const { content, redisRepo } = updateArg;
  const folders = await Promise.all(
    content.folders.map(async name => {
      const id = await redisRepo.getKey(`folders:${name}`);
      if (!id) return { name };
      return { id };
    })
  );
  const groups = await Promise.all(
    content.groups.map(async name => {
      const id = await redisRepo.getKey(`groups:${name}`);
      if (!id) return { name };
      return { id };
    })
  );
  const author = await redisRepo.getKey(`author:${content.author}`).then(id => {
    if (!id) return { name: content.author };
    return { id };
  });
  const contributors = await Promise.all(
    content.contributors.map(async name => {
      const id = await redisRepo.getKey(`contributors:${name}`);
      if (!id) return { name };
      return { id };
    })
  );
  return {
    [Config.Notion.Props.AUTHOR]: author,
    [Config.Notion.Props.CONTRIBUTORS]: contributors,
    [Config.Notion.Props.FOLDERS]: folders,
    [Config.Notion.Props.GROUPS]: groups,
    [Config.Notion.Props.COMMENTS]: content.comments.map(comment => {
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
    }),
  };
};
