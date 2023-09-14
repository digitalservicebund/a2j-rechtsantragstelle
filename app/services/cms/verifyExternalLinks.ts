import fs from "node:fs";
import { configDotenv } from "dotenv";

const allowedExternalLinks = [
  "https://github.com",
  "https://digitalservice.bund.de",
  "https://www.bmj.de",
  "https://strapi.io",
  "https://www.hamburg.de",
  "https://www.justiz.bremen.de",
  "https://justiz.de",
  "https://www.justiz.de",
  "https://a2j-rast-stag.dev.ds4g.net",
  "https://www.gesetze-im-internet.de",
  "https://www.schlichtungsstelle-bgg.de",
  "https://posthog.com",
  "https://www.bfdi.bund.de",
  "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com",
];

function verifyExternalLinks() {
  configDotenv();
  const filePath = process.env.CONTENT_FILE_PATH ?? "./content.json";
  const content = fs.readFileSync(filePath, "utf-8");

  const urlRegex =
    /((https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  const linksFromContent = content.match(urlRegex);

  if (linksFromContent) {
    for (const link of linksFromContent) {
      const rejectedUrl = !allowedExternalLinks.some((allowedLinks) =>
        link.includes(allowedLinks),
      );
      if (rejectedUrl)
        throw Error(
          `${link} is not allowed. Please verify the URL and add to the allowed list`,
        );
    }
  }
}

if (process.argv[2] === "verifyExternalLinks") verifyExternalLinks();
