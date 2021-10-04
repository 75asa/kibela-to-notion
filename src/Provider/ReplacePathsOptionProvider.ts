import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import fs from "fs";
import { Config } from "~/Config";
import { ReplacerOptions } from "~/Model/ReplacerOptions";

const { NOTES, OUT } = Config.Markdown.Path;

const optionDefinitions: OptionDefinition[] = [
  {
    name: "notes",
    alias: "n",
    type: String,
  },
  {
    name: "delimiter",
    alias: "d",
    type: String,
  },
];

export const generateImageOption = (): ReplacerOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const notesPath = options.notes
    ? path.resolve(__dirname, `../../${options.notes as string}`)
    : NOTES;
  const delimiter = options.delimiter
    ? options.delimiter
    : new Date().toISOString();
  const outPath = `${OUT}/${delimiter}`;

  fs.mkdir(outPath, err => {
    throw err;
  });
  console.log({ notesPath, delimiter, outPath });

  return { notesPath, delimiter, outPath };
};
