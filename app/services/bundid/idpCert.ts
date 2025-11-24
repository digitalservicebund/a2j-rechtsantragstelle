import { XMLParser } from "fast-xml-parser";

const BUNDID_IDP_URL = "https://id.bund.de/idp";

let idpCert: string | undefined = undefined;

const parser = new XMLParser({
  tagValueProcessor(tagName, tagValue) {
    if (tagName === "ds:X509Certificate") idpCert = tagValue;
  },
});

export async function fetchIdpCert() {
  if (!idpCert) {
    await fetch(BUNDID_IDP_URL).then(async (response) => {
      await response.text().then((XMLdata) => parser.parse(XMLdata));
    });
  }
  return idpCert;
}
