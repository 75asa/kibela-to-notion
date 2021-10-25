import fs from "fs";

const fsPromises = fs.promises;

export const directoryExists = async (filepath: string) => {
  try {
    return (await fsPromises.lstat(filepath)).isDirectory();
  } catch (error) {
    console.error({ error });
    return false;
  }
};

export const mkdir = async (filepath: string) => {
  try {
    const result = await fsPromises.mkdir(filepath, { recursive: true });
    if (!result) throw new Error("Failed to create directory");
  } catch (error) {
    throw error;
  }
};
