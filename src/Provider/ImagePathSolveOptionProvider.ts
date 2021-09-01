import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { ImageOptions } from "~/Model/ImageOptions";

const optionDefinitions: OptionDefinition[] = [
  {
    name: "path",
    alias: "P",
    type: String,
  },
];

export const generateImageOption = (): ImageOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const notesPath = options.path
    ? path.resolve(__dirname, options.path as string)
    : Config.Markdown.Path.NOTES;
  return { notesPath };
};
