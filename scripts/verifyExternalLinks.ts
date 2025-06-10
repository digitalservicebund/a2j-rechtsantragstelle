import fs from "node:fs";
import { configDotenv } from "dotenv";
import { allowedEmails } from "./data/allowedEmails.server";
import { allowedWebsites } from "./data/allowedWebsites.server";

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
