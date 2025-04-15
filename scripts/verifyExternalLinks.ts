import fs from "node:fs";
import { configDotenv } from "dotenv";
import { bucketUrl } from "~/services/cms/bucketUrl";

const allowedWebsites = [
  bucketUrl,
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
  "https://policies.google.com",
  "https://app.formbricks.com",
  "https://formbricks.com",
  "https://transport.ec.europa.eu",
  "www.schlichtung-reise-und-verkehr.de",
  "https://www.personalausweisportal.de",
  "https://www.mjp.justiz.de",
  "https://europa.eu",
  "https://www.brak.de",
  "https://formulare.bfdi.bund.de",
  "https://www.justizadressen.nrw.de",
  "https://www.datenschutzkonferenz-online.de",
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
  "datenschutz@ag-wuppertal.nrw.de",
  "marcel.bosse@ag-bochum.nrw.de",
  "sophie.lieb@aq-rheinbach.nrw.de",
  "heike.parpart@ag-koeln.nrw.de",
  "juergen.meier@ag-bielefeld.nrw.de",
  "feedback-justiz-services@digitalservice.bund.de",
  "wolfgang.kracker-thieme@ag-n.bayern.de",
  "poststelle@justiz.saarland.de",
  "b.spaniol@agotw.justiz.saarland.de",
  "poststelle@justiz.saarland.de",
  "kontakt@service.justiz.de",
];

const regexValidator = {
  email: /(^[\w.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/g,
  url: /((https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
};

function verifyExternalLinks(allowedList: string[], regexPattern: RegExp) {
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

function isLinkRejected(link: string, allowedList: string[]) {
  return !allowedList.some((allowedLink) => link.includes(allowedLink));
}

if (process.argv[2] === "verifyWebsites")
  verifyExternalLinks(allowedWebsites, regexValidator.url);
if (process.argv[2] === "verifyEmails")
  verifyExternalLinks(allowedEmails, regexValidator.email);
