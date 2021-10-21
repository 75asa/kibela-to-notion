import { Config } from "~/Config";

export interface UploaderOptions {
  attachmentsPath: string;
  delimiter: string;
  storageMode: Config.Storage.Mode;
}
