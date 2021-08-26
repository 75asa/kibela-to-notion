import commandLineArgs, { OptionDefinition } from "command-line-args";
import { Config } from "src/Config";
import { TagOptions } from "src/Model/TagOptions";
import path from "path";

const optionDefinitions: OptionDefinition[] = [
  {
    name: "path",
    alias: "P",
    type: String,
  },
];

export const generateOption = (): TagOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const notesPath = options.path
    ? path.resolve(__dirname, options.path as string)
    : Config.Markdown.Path.NOTES;
  return { notesPath };
};
