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
  {
    name: "max",
    alias: "m",
    type: Number,
  },
];

export const generateUploadImagesOption = (): UploaderOptions[] => {
  const { attachments, delimiter, storage, max } = commandLineArgs(
    optionDefinitions,
    { partial: true }
  );
  if (max) {
    return Array.from({ length: max + 1 }, (_, i) => {
      return {
        delimiterName: String(i),
        attachmentsPath: path.resolve(
          __dirname,
          `../../${Config.Markdown.EXPORTED_TEAM_NAME}-${i}/attachments`
        ),
        storageMode: storage,
      };
    });
  }
  const { ATTACHMENTS } = Config.Markdown.Path;
  const attachmentsPath = attachments
    ? path.resolve(__dirname, `../../${attachments as string}`)
    : ATTACHMENTS;
  const delimiterName = delimiter ? delimiter : new Date().toISOString();
  const storageMode: Config.Storage.Mode = storage;
  console.log({ attachmentsPath, delimiter, storageMode });
  return [{ attachmentsPath, delimiterName, storageMode }];
};
