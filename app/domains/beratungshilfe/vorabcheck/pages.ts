import pick from "lodash/pick";
import { beratungshilfeVorabcheckInputSchema as schemas } from "./userData";
import type { PagesConfig } from "../../pageConfig";

export const beratungshilfeVorabcheckPages = {
  rechtsschutzversicherung: {
    pageSchema: pick(schemas, "rechtsschutzversicherung"),
  },
  "rechtsschutzversicherung-details": {
    pageSchema: pick(schemas, "rsvCoverage"),
  },
  "ergebnis/rechtsschutzversicherung-abbruch": {},
  "rechtsschutzversicherung-hinweis-selbstbeteiligung": {},
  "ergebnis/rechtsschutzversicherung-ungewiss-abbruch": {},
  "ergebnis/rechtsschutzversicherung-hinweis-kostenuebernahme": {},
  "wurde-verklagt": {
    pageSchema: pick(schemas, "wurdeVerklagt"),
  },
  "ergebnis/wurde-verklagt-abbruch": {},
  "klage-eingereicht": {
    pageSchema: pick(schemas, "klageEingereicht"),
  },
  "ergebnis/klage-eingereicht-abbruch": {},
  "hamburg-oder-bremen": { pageSchema: pick(schemas, "hamburgOderBremen") },
  "ergebnis/hamburg-oder-bremen-abbruch": {},
  "beratungshilfe-beantragt": {
    pageSchema: pick(schemas, "beratungshilfeBeantragt"),
  },
  "ergebnis/beratungshilfe-beantragt-abbruch": {},
  eigeninitiative: { pageSchema: pick(schemas, "eigeninitiative") },
  "eigeninitiative-warnung": {},
  bereich: { pageSchema: pick(schemas, "bereich") },
  "staatliche-leistungen": {
    pageSchema: pick(schemas, "staatlicheLeistungen"),
  },
  "ergebnis/staatliche-leistungen-abschluss-vielleicht": {},
  "ergebnis/staatliche-leistungen-abschluss-ja": {},
  vermoegen: { pageSchema: pick(schemas, "vermoegen") },
  "ergebnis/vermoegen-abschluss-ja": {},
  "ergebnis/vermoegen-abschluss-vielleicht": {},
  "ergebnis/vermoegen-abschluss-abbruch": {},
  erwerbstaetigkeit: { pageSchema: pick(schemas, "erwerbstaetigkeit") },
  partnerschaft: { pageSchema: pick(schemas, "partnerschaft") },
  genauigkeit: { pageSchema: pick(schemas, "genauigkeit") },
  "kinder-kurz": { pageSchema: pick(schemas, "kinderKurz") },
  "kinder-anzahl-kurz": { pageSchema: pick(schemas, "kinderAnzahlKurz") },
  "verfuegbares-einkommen": {
    pageSchema: pick(schemas, "verfuegbaresEinkommen"),
  },
  "ergebnis/verfuegbares-einkommen-abschluss-ja": {},
  "ergebnis/verfuegbares-einkommen-abschluss-vielleicht": {},
  "ergebnis/verfuegbares-einkommen-abschluss-nein": {},
} as const satisfies PagesConfig;
