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
    name: "maxNumber",
    alias: "m",
    type: Number,
  },
  {
    name: "startNumber",
    alias: "s",
    type: Number,
  },
];

export const generateTagOption = (): TaggerOptions[] => {
  const { notes, startNumber, maxNumber } = commandLineArgs(optionDefinitions, {
    partial: true,
  });

  if (maxNumber !== undefined && startNumber === undefined) {
    return Array.from({ length: maxNumber + 1 }, (_, i) => {
      return {
        notesPath: path.join(Config.Markdown.Path.OUT, String(i)),
      };
    });
  } else if (maxNumber !== undefined && startNumber !== undefined) {
    return Array.from({ length: startNumber + 1 }, (_, i) => {
      if (i > maxNumber) return;
      return {
        notesPath: path.join(Config.Markdown.Path.OUT, String(i)),
      };
    }).filter(
      (item): item is Exclude<typeof item, undefined> => item !== undefined
    );
  }
  const notesPath = notes
    ? path.resolve(__dirname, `../../${notes as string}`)
    : Config.Markdown.Path.NOTES;
  return [{ notesPath }];
};
