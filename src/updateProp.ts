import {
  SelectOption,
  SelectOptionWithName,
  RichText,
} from "@notionhq/client/build/src/api-types";
import { KibelaMetaData } from "./parser";

interface UpdatePropertiesProp {
  author: SelectOption;
  contributors: SelectOptionWithName[];
  folders: SelectOptionWithName[];
  groups: SelectOptionWithName[];
  comments: RichText[];
}

export const getUpdateProperties = (
  content: KibelaMetaData
): UpdatePropertiesProp => {
  return {
    author: {
      name: content.author,
    },
    contributors: content.contributors.map(user => {
      return { name: user };
    }),
    folders: content.folders.map(folder => {
      return { name: folder };
    }),
    groups: content.groups.map(group => {
      return { name: group };
    }),
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
