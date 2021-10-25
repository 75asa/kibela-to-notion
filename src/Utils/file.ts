import fs from "fs";

export const directoryExists = async (filepath: string) => {
  try {
    return !!(await fs.promises.lstat(filepath)).isDirectory();
  } catch (error) {
    console.error({ error });
    return false;
  }
};
