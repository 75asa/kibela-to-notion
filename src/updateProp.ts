import { SelectOption, RichText } from "@notionhq/client/build/src/api-types";
import { KibelaMetaData } from "./metaParser";
import { RedisRepository } from "./repository/RedisRepository";

interface UpdatePropertiesProp {
  author: SelectOption;
  contributors: SelectOption[];
  folders: SelectOption[];
  groups: SelectOption[];
  comments: RichText[];
}

export const getUpdateProperties = async (
  content: KibelaMetaData,
  redisRepo: RedisRepository
): Promise<UpdatePropertiesProp> => {
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
    author,
    contributors,
    folders,
    groups,
    comments: content.comments.map(comment => {
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
