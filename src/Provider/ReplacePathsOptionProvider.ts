import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { ImageOptions } from "~/Model/ImageOptions";

const optionDefinitions: OptionDefinition[] = [
  {
    name: "notes",
    alias: "n",
    type: String,
  },
  {
    name: "attachments",
    alias: "a",
    type: String,
  },
  {
    name: "deliminator",
    alias: "d",
    type: String,
  },
];

export const generateImageOption = (): ImageOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const notesPath = options.notes
    ? path.resolve(__dirname, options.notes as string)
    : Config.Markdown.Path.ATTACHMENTS;
  const attachmentsPath = options.attachments
    ? path.resolve(__dirname, options.attachments as string)
    : Config.Markdown.Path.ATTACHMENTS;
  const deliminator = options.deliminator || 0;
  return { notesPath, attachmentsPath, deliminator };
};
