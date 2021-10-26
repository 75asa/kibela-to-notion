import { Config } from "~/Config";

export interface UploaderOptions {
  attachmentsPath: string;
  delimiterName: string;
  storageMode: Config.Storage.Mode;
}
