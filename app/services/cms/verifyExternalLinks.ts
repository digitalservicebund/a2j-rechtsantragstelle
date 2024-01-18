import fs from "node:fs";
import { configDotenv } from "dotenv";

const allowedWebsites = [
  "https://github.com",
  "https://digitalservice.bund.de",
  "https://www.bmj.de",
  "https://strapi.io",
  "https://www.hamburg.de",
  "https://www.justiz.bremen.de",
  "https://justiz.de",
  "https://www.justiz.de",
  "https://service.justiz.de",
  "https://a2j-rast-stag.dev.ds4g.net",
  "https://www.gesetze-im-internet.de",
  "https://www.schlichtungsstelle-bgg.de",
  "https://posthog.com",
  "https://www.bfdi.bund.de",
  "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com",
  "https://soep-online.de/",
  "https://www.bundesjustizamt.de/",
  "https://service.justiz.de/",
  "https://www.luftlinie.org",
  "https://www.verbraucherzentrale.de",
  "https://www.zugang-zum-recht-projekte.de",
];

const allowedEmails = [
  "services@digitalservice.bund.de",
  "rastdigital@digitalservice.bund.de",
  "info@schlichtungsstelle-bgg.de",
  "datenschutz@bmj.bund.de",
  "datenschutz@digitalservice.bund.de",
  "poststelle@bmj.bund.de",
  "poststelle@bfdi.bund.de",
  "poststelle@bfdi.de-mail.de",
];

const regexValidator = {
  email: /(\w+@[\w.-]+\w)/g,
  url: /((https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
};

function verifyExternalLinks(allowedList: Array<string>, regexPattern: RegExp) {
  configDotenv();
  const filePath = process.env.CONTENT_FILE_PATH ?? "./content.json";
  const content = fs.readFileSync(filePath, "utf-8");

  const linksFromContent = regexPattern.exec(content);

  if (linksFromContent) {
    for (const link of linksFromContent) {
      const rejectedUrl = !allowedList.some((allowedLinks) =>
        link.includes(allowedLinks),
      );

      if (rejectedUrl)
        throw Error(
          `${link} is not allowed. Please verify the link and add to the allowed list`,
        );
    }
  }
}

if (process.argv[2] === "verifyWebsites")
  verifyExternalLinks(allowedWebsites, regexValidator.url);
if (process.argv[2] === "verifyEmails")
  verifyExternalLinks(allowedEmails, regexValidator.email);
