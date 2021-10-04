import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { ReplacerOptions } from "~/Model/ReplacerOptions";

const { NOTES, ATTACHMENTS, OUT } = Config.Markdown.Path;

const optionDefinitions: OptionDefinition[] = [
  {
    name: "notes",
    alias: "n",
    type: String,
  },
  {
    name: "out",
    alias: "o",
    type: String,
  },
];

export const generateImageOption = (): ReplacerOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const notesPath = options.notes
    ? path.resolve(__dirname, options.notes as string)
    : NOTES;
  const attachmentsPath = options.attachments
    ? path.resolve(__dirname, options.attachments as string)
    : ATTACHMENTS;
  const outPath = options.out
    ? path.resolve(__dirname, options.out as string)
    : OUT;
  const deliminator = options.deliminator || 0;
  return { notesPath, attachmentsPath, deliminator, outPath };
};
