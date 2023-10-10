import * as https from "https";
import * as fs from "fs";
import path from "path";

const githubrawTypesGeneratedUrl =
  "https://raw.githubusercontent.com/digitalservicebund/a2j-rechtsantragstelle-strapi/main/types/generated";

const serviceDirectory = "app/services/cms/models/";

const generate = () => {
  const componentsFile = fs.createWriteStream(
    path.join(process.cwd(), serviceDirectory, "components.d.ts"),
  );
  const contentTypesFile = fs.createWriteStream(
    path.join(process.cwd(), serviceDirectory, "contentTypes.d.ts"),
  );

  https.get(
    `${githubrawTypesGeneratedUrl}/components.d.ts`,
    function (response) {
      response.pipe(componentsFile);

      // after download completed close filestream
      componentsFile.on("finish", () => {
        componentsFile.close();
        console.log("Download Completed");
      });
    },
  );

  https.get(
    `${githubrawTypesGeneratedUrl}/contentTypes.d.ts`,
    function (response) {
      response.pipe(contentTypesFile);

      // after download completed close filestream
      contentTypesFile.on("finish", () => {
        contentTypesFile.close();
        console.log("Download Completed");
      });
    },
  );
};

generate();
