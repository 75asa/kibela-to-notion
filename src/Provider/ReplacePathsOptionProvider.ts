import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { ReplacerOptions } from "~/Model/ReplacerOptions";
import { directoryExists, mkdir } from "../Utils";

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

export const generateReplaceOption = async (): Promise<ReplacerOptions> => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const { notes, delimiter } = options;
  const notesPath = notes
    ? path.resolve(__dirname, `../../${notes as string}`)
    : NOTES;
  const delimiterName = delimiter ? delimiter : new Date().toISOString();
  const outPath = path.join(OUT, delimiterName);

  if (!(await directoryExists(outPath))) await mkdir(outPath);

  console.log({ notesPath, delimiterName, outPath });

  return { notesPath, delimiterName, outPath };
};
