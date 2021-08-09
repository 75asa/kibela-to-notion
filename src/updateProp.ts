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
    content.folders.map(async folder => {
      const folderId = await redisRepo.get(`folders:${folder}`);
      if (!folderId) return { name: folder };
      return { id: folderId! };
    })
  );
  const groups = await Promise.all(
    content.groups.map(async group => {
      const groupId = await redisRepo.get(`groups${group}`);
      if (!groupId) return { name: group };
      return { id: groupId };
    })
  );
  return {
    author: {
      name: content.author,
    },
    contributors: content.contributors.map(user => {
      return { name: user };
    }),
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
