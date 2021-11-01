import commandLineArgs, { OptionDefinition } from "command-line-args";
import { Config } from "~/Config";

const { REPLACE_PATHS, TAG_NOTES, UPLOAD_IMAGES } = Config.Mode;
const optionDefinitions: OptionDefinition[] = [
  {
    name: "mode",
    type: String,
    defaultOption: true,
  },
];

export const provideOptions = ():
  | typeof REPLACE_PATHS
  | typeof TAG_NOTES
  | typeof UPLOAD_IMAGES => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const mode = options.mode;
  if (!mode) {
    throw new Error("No mode provided");
  }

  if (!Object.values(Config.Mode).includes(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  return mode;
};
