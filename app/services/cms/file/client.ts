import type { Page } from "~/services/cms/models/Page";
import type { ElementWithId } from "~/services/cms/models/ElementWithId";
import type { ErrorCategory } from "~/services/cms/models/ErrorCategory";
import type { SingleComponentCMS } from "~/services/cms/models/singleComponents";
import type { VorabCheckCommons } from "~/services/cms/models/commons/VorabCheckCommons";
import type { ResultPage } from "~/services/cms/models/ResultPage";
import type { VorabcheckPage } from "~/services/cms/models/VorabcheckPage";
import fs from "fs";
import path from "path";

export const getContentFilePath = (
  filePath: string,
  workingDirectory?: string
) => {
  const directory = workingDirectory ? [workingDirectory] : [__dirname, ".."]; // leave build directory
  return path.join(...directory, filePath);
};

export const loadContentFile = (filePath: string) => {
  const content = fs.readFileSync(filePath);
  const jsonContent = JSON.parse(content.toString());
  // TODO refine type to avoid unknown casting
  return jsonContent as unknown as Record<
    string,
    | {
        attributes:
          | Page
          | VorabcheckPage
          | ResultPage
          | ElementWithId
          | ErrorCategory;
      }[]
    | { attributes: SingleComponentCMS | VorabCheckCommons }
  >;
};
