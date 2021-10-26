import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { AllUploaderOptions } from "../Model/AllUploaderOptions";

const optionDefinitions: OptionDefinition[] = [
  {
    name: "max",
    alias: "m",
    type: Number,
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

export const generateUploadAllImagesOption = (): AllUploaderOptions => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const { max, storage } = options;
  if (!max) throw new Error("max: number is required");
  const uploadTargets = Array.from({ length: max + 1 }, (_, i) => {
    return {
      delimiterName: String(i),
      attachmentsPath: path.resolve(
        __dirname,
        `../../${Config.Markdown.EXPORTED_TEAM_NAME}-${i}/attachments`
      ),
    };
  });
  console.dir({ uploadTargets }, { depth: null });
  const storageMode: Config.Storage.Mode = storage;
  return { uploadTargets, storageMode };
};
