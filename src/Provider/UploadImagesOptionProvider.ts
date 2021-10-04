import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { UploaderOptions } from "~/Model/UploaderOptions";

const { ATTACHMENTS } = Config.Markdown.Path;

const optionDefinitions: OptionDefinition[] = [
  {
    name: "attachments",
    alias: "a",
    type: String,
  },
  {
    name: "delimiter",
    alias: "d",
    type: String,
  },
];

export const generateUploadImagesOption = (): UploaderOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const attachmentsPath = options.attachments
    ? path.resolve(__dirname, `../../${options.attachments as string}`)
    : ATTACHMENTS;
  const delimiter = options.delimiter
    ? options.delimiter
    : new Date().toISOString();
  console.log({ attachmentsPath, delimiter });
  return { attachmentsPath, delimiter };
};
