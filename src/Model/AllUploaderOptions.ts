import { Config } from "~/Config";

export interface AllUploaderOptions {
  uploadTargets: {
    delimiterName: string;
    attachmentsPath: string;
  }[];
  storageMode: Config.Storage.Mode;
}
