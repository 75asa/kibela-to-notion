import { ReplacePaths } from "./Bootstrap/ReplacePaths";
import { Tag } from "./Bootstrap/Tag";
import { Config } from "./Config";
import { provideOptions } from "./Provider/MainProvider";

const { REPLACE_PATHS, TAG_NOTES } = Config.Mode;

(async () => {
  const mode = provideOptions();
  switch (mode) {
    case REPLACE_PATHS:
      await ReplacePaths();
      break;
    case TAG_NOTES:
      await Tag();
      break;
    default:
      break;
  }
  process.exit();
})();
