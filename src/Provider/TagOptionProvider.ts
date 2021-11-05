import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { TaggerOptions } from "~/Model/TaggerOptions";

const optionDefinitions: OptionDefinition[] = [
  {
    name: "notes",
    alias: "n",
    type: String,
  },
  {
    name: "max",
    alias: "m",
    type: Number,
  },
];

export const generateTagOption = (): TaggerOptions[] => {
  const { notes, max } = commandLineArgs(optionDefinitions, { partial: true });

  if (max) {
    return Array.from({ length: max + 1 }, (_, i) => {
      return {
        notesPath: path.join(Config.Markdown.Path.OUT, String(i)),
      };
    });
  }
  const notesPath = notes
    ? path.resolve(__dirname, `../../${notes as string}`)
    : Config.Markdown.Path.NOTES;
  return [{ notesPath }];
};
