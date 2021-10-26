import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { AllReplacerOptions } from "../Model/ReplacerAllOptions";
import { directoryExists, mkdir } from "../Utils";
const { NOTES, OUT } = Config.Markdown.Path;
const optionDefinitions: OptionDefinition[] = [
  {
    name: "max",
    alias: "m",
    type: Number,
  },
];

const getReplaceTargets = async (max: number) => {
  return await Promise.all(
    Array.from({ length: max + 1 }, async (_, i) => {
      const delimiterName = String(i);
      const outPath = path.join(OUT, delimiterName);
      if (!(await directoryExists(outPath))) await mkdir(outPath);
      return {
        delimiterName,
        outPath,
        notesPath: path.resolve(
          __dirname,
          `../../${Config.Markdown.EXPORTED_TEAM_NAME}-${i}/notes`
        ),
      };
    })
  );
};

export const generateReplaceAllOption = async (): Promise<
  AllReplacerOptions[]
> => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const { max } = options;
  if (!max) throw new Error("max: number is required");
  return await getReplaceTargets(max);
};
