import commandLineArgs, { OptionDefinition } from "command-line-args";
import { Config } from "~/Config";

const { REPLACE_PATHS, TAG_NOTES } = Config.Mode;
const optionDefinitions: OptionDefinition[] = [
  {
    name: "mode",
    type: String,
    defaultOption: true,
  },
];

export const provideOptions = (): typeof REPLACE_PATHS | typeof TAG_NOTES => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const mode = options.mode;
  if (!mode) {
    throw new Error(
      `mode is required and must be "${REPLACE_PATHS}" or "${TAG_NOTES}".\n
      your command line args: ${JSON.stringify(options, null, 2)}`
    );
  }

  return mode;
};
