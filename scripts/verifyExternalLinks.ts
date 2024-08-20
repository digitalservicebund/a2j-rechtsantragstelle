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
  "https://www.evz.de",
  "https://www.justiz.nrw.de",
  "https://www.justiz.nrw",
  "https://rechtohnestreit.de",
  "https://e-justice.europa.eu",
  "https://www.ausweisapp.bund.de",
  "https://id.bund.de",
  "https://ebo.bund.de",
  "https://ec.europa.eu",
  "https://sentry.io",
  "https://www.verbraucherzentrale.nrw",
  "https://www.youtube.com",
];

const allowedEmails = [
  "services@digitalservice.bund.de",
  "rastdigital@digitalservice.bund.de",
  "info@schlichtungsstelle-bgg.de",
  "datenschutz@bmj.bund.de",
  "datenschutz@digitalservice.bund.de",
  "datenschutzbeauftragter@mi.niedersachsen.de",
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

  const foundLinks = extractLinks(content, regexPattern);

  foundLinks
    .filter((link) => isLinkRejected(link, allowedList))
    .forEach((link) => {
      throw new Error(
        `${link} is not allowed. Please verify the link and add it to the allowed list`,
      );
    });
}

function extractLinks(content: string, regexPattern: RegExp) {
  const matches = Array.from(content.matchAll(regexPattern));
  return matches.map((match) => match[0]);
}

function isLinkRejected(link: string, allowedList: Array<string>) {
  return !allowedList.some((allowedLink) => link.includes(allowedLink));
}

if (process.argv[2] === "verifyWebsites")
  verifyExternalLinks(allowedWebsites, regexValidator.url);
if (process.argv[2] === "verifyEmails")
  verifyExternalLinks(allowedEmails, regexValidator.email);
