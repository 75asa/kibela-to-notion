import commandLineArgs, { OptionDefinition } from "command-line-args";
import { Config } from "src/Config";
import { TagOptions } from "src/Model/TagOptions";

const optionDefinitions: OptionDefinition[] = [
  {
    name: "path",
    alias: "P",
    type: String,
  },
];

export const generateOption = (): TagOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const path = (options.path as string) || Config.Markdown.Path.NOTES;
  return { notesPath: path };
};
