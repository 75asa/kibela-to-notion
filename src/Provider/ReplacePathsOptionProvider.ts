import commandLineArgs, { OptionDefinition } from "command-line-args";
import path from "path";
import { Config } from "~/Config";
import { ReplacerOptions } from "~/Model/ReplacerOptions";
import { directoryExists, mkdir } from "../Utils";

const { NOTES, OUT } = Config.Markdown.Path;

const optionDefinitions: OptionDefinition[] = [
  {
    name: "notes",
    alias: "n",
    type: String,
  },
  {
    name: "delimiter",
    alias: "d",
    type: String,
  },
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

export const generateReplaceOption = async (): Promise<ReplacerOptions[]> => {
  const { notes, delimiter, max } = commandLineArgs(optionDefinitions, {
    partial: true,
  });

  if (max) {
    return await getReplaceTargets(max);
  }
  const notesPath = notes
    ? path.resolve(__dirname, `../../${notes as string}`)
    : NOTES;
  const delimiterName = delimiter ? delimiter : new Date().toISOString();
  const outPath = path.join(OUT, delimiterName);

  if (!(await directoryExists(outPath))) await mkdir(outPath);

  console.log({ notesPath, delimiterName, outPath });

  return [{ notesPath, delimiterName, outPath }];
};
