import fs from "node:fs";
import { XMLBuilder } from "fast-xml-parser";
import type {
  document as GeneratedBerHType,
  TypeGDSGrunddaten,
} from "data/xml/generated/ts/www.xjustiz.de/d";
import { today } from "~/util/date";

export type TypedBerHXJustizData =
  GeneratedBerHType["nachrichtrastantragBeratungshilfe3400001"];

function generateXML() {
  const tsObject: Partial<TypedBerHXJustizData> = {
    fachdaten: {
      auswahl_sozialhilfeBewilligt: {
        ja: false,
        nein: {
          erwerbstaetig: false,
          monatlicheEinkuenfteInEuro: {
            // @ts-expect-error incomplete type
            einkuenfteAntragsteller: {
              netto: 1000,
            },
          },
        },
      },
      sachverhalt: "",
      versicherungen: "",
      // @ts-expect-error incomplete type
      voraussetzungenErfuellt: {
        keineAndereKostenloseBeratung: false,
        keineBeratungshilfeDieseAngelegenheit: false,
        keineRechtsschutzversicherung: false,
        keinGerichtlichesVerfahren: false,
      },
    },
    grunddaten: {} as TypeGDSGrunddaten,
    // @ts-expect-error incomplete type
    nachrichtenkopf: {
      xjustizVersion: "",
      eigeneNachrichtenID: "",
      erstellungszeitpunkt: today(),
    },
  };
  const builder = new XMLBuilder({
    format: true,
  });
  function prependKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(prependKeys);
    } else if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          `tns:${key}`,
          prependKeys(value),
        ]),
      );
    }
    return obj;
  }
  fs.writeFile(
    "data/xml/generated.xml",
    builder.build(prependKeys(tsObject)),
    (error) => {
      if (error) {
        console.error(error);
        throw error;
      }
    },
  );
}

generateXML();
