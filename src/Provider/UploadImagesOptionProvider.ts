import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { UploaderOptions } from "~/Model/UploaderOptions";

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
  {
    name: "storage",
    alias: "s",
    type: (value: string) => {
      if ((value as Config.Storage.Mode) === "S3") {
        return value as Config.Storage.Mode;
      } else if ((value as Config.Storage.Mode) === "GoogleDrive") {
        return value;
      } else {
        throw new Error(`Invalid storage type: actual input is ${value}`);
      }
    },
  },
];

export const generateUploadImagesOption = (): UploaderOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const { ATTACHMENTS } = Config.Markdown.Path;
  const attachmentsPath = options.attachments
    ? path.resolve(__dirname, `../../${options.attachments as string}`)
    : ATTACHMENTS;
  const delimiter = options.delimiter
    ? options.delimiter
    : new Date().toISOString();
  const storageMode: Config.Storage.Mode = options.storage;
  console.log({ attachmentsPath, delimiter, storageMode });
  return { attachmentsPath, delimiter, storageMode };
};
