import commandLineArgs, { OptionDefinition } from "command-line-args";
import { Config } from "~/Config";

const { SOLVE_IMAGE, TAG_NOTES } = Config.Mode;
const optionDefinitions: OptionDefinition[] = [
  {
    name: "mode",
    type: String,
    defaultOption: true,
  },
];

export const provideOptions = (): typeof SOLVE_IMAGE | typeof TAG_NOTES => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const mode = options.mode;
  if (!mode) {
    throw new Error(`mode is required and must be "crawl" or "report".`);
  }

  return mode;
};
