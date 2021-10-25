import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import fs from "fs";
import { Config } from "~/Config";
import { ReplacerOptions } from "~/Model/ReplacerOptions";
import { directoryExists } from "../Utils";

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

// export const generateImageOption = (): ReplacerOptions => {
export const generateImageOption = async (): Promise<ReplacerOptions> => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const { notes, delimiter } = options;
  const notesPath = notes
    ? path.resolve(__dirname, `../../${notes as string}`)
    : NOTES;
  const delimiterName = delimiter ? delimiter : new Date().toISOString();
  // const outPath = `${OUT}/${delimiter}`;
  const outPath = path.join(OUT, delimiterName);
  // const outPath = path.join(OUT, delimiterName, "HOGE");

  // fs.mkdir(outPath, { recursive: true }, err => {
  //   throw err;
  // });

  // NOTE: directoryExists() も機能してない
  if (await directoryExists(outPath)) {
    fs.mkdir(outPath, { recursive: true }, err => {
      throw err;
    });
  }

  console.log({ notesPath, delimiterName, outPath });

  return { notesPath, delimiterName, outPath };
};
