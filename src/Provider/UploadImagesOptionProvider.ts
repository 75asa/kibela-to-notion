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
  const { attachments, delimiter, storage } = options;
  const { ATTACHMENTS } = Config.Markdown.Path;
  const attachmentsPath = attachments
    ? path.resolve(__dirname, `../../${attachments as string}`)
    : ATTACHMENTS;
  const delimiterName = delimiter ? delimiter : new Date().toISOString();
  const storageMode: Config.Storage.Mode = storage;
  console.log({ attachmentsPath, delimiter, storageMode });
  return { attachmentsPath, delimiterName, storageMode };
};
