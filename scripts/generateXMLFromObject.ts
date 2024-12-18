import fs from "node:fs";
import { XMLBuilder } from "fast-xml-parser";
import type {
  document as GeneratedBerHType,
  TypeGDSGrunddaten,
} from "xmlns/www.xjustiz.de/d";

export type TypedBerHXJustizData =
  GeneratedBerHType["nachrichtrastantragBeratungshilfe3400001"];

function generateXML() {
  const builder = new XMLBuilder();
  const tsObject: TypedBerHXJustizData = {
    fachdaten: {
      auswahl_sozialhilfeBewilligt: undefined,
      sachverhalt: "",
      versicherungen: "",
      voraussetzungenErfuellt: {
        keineAndereKostenloseBeratung: false,
        keineBeratungshilfeDieseAngelegenheit: false,
        keineRechtsschutzversicherung: false,
        keinGerichtlichesVerfahren: false,
      },
    },
    grunddaten: {} as TypeGDSGrunddaten,
    nachrichtenkopf: {
      xjustizVersion: "",
      auswahl_absender: undefined,
      auswahl_empfaenger: undefined,
      eigeneNachrichtenID: "",
      erstellungszeitpunkt: undefined,
      _exists: false,
      _namespace: "",
    },
  };
  console.log(tsObject);
  fs.writeFile(
    "data/xml/generated.xml",
    builder.build({ test: "test" }),
    (error) => {
      if (error) {
        console.error(error);
        throw error;
      }
    },
  );
}

generateXML();
