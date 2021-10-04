import { ReplacePaths, UploadImages, Tag } from "./Bootstrap";
import { Config } from "./Config";
import { provideOptions } from "./Provider/MainProvider";

const { REPLACE_PATHS, TAG_NOTES, UPLOAD_IMAGES } = Config.Mode;

(async () => {
  const mode = provideOptions();
  switch (mode) {
    case REPLACE_PATHS:
      await ReplacePaths();
      break;
    case TAG_NOTES:
      await Tag();
      break;
    case UPLOAD_IMAGES:
      await UploadImages();
      break;
    default:
      break;
  }
  process.exit();
})();
