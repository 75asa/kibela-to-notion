import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { AllReplacerOptions } from "../Model/ReplacerAllOptions";
import { directoryExists, mkdir } from "../Utils";

const { OUT } = Config.Markdown.Path;
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
      const notesPath = path.resolve(
        __dirname,
        `../../${Config.Markdown.EXPORTED_TEAM_NAME}-${delimiterName}/notes`
      );
      console.log({ delimiterName, notesPath, outPath });
      const isOutDirectoryExists = await directoryExists(outPath);
      if (!isOutDirectoryExists) await mkdir(outPath);
      const isNotesDirectoryExits = await directoryExists(notesPath);
      // NOTE: in case of notes directory is not exists, skip this delimiter
      if (!isNotesDirectoryExits) await mkdir(notesPath);
      return {
        delimiterName,
        outPath,
        notesPath,
      };
    })
  );
};

export const generateReplaceAllOption = async (): Promise<
  AllReplacerOptions[]
> => {
  const options = commandLineArgs(optionDefinitions, { partial: true });
  const { max } = options;
  console.log({ max });
  if (!max) throw new Error("max: number is required");
  return await getReplaceTargets(max);
};
