import { renderToStream } from "@react-pdf/renderer";
import type {
  BeratungshilfePDF,
  StringField,
  BooleanField,
} from "./beratungshilfe.generated";
import { Convert } from "./beratungshilfe.generated";
import fs from "node:fs";
import path from "node:path";
import { type PDFForm, PDFDocument, PDFTextField, PDFCheckBox } from "pdf-lib";
import { normalizePropertyName } from "../pdf.server";
import FormAttachment from "~/components/FormAttachment";

import _ from "lodash";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { BeratungshilfeAntragContext } from "~/models/flows/beratungshilfeFormular";

const isANewAttachmentPageNeeded = (context: BeratungshilfeAntragContext) => {
  const descriptions = [];

  if (context.bereich) {
    // TODO move to another function and use strapi as a source
    const bereichMapping = {
      authorities: "Behörden",
      living: "Wohnen",
      work: "Arbeit",
      separation: "Trennung & Unterhalt",
      trade: "Handel & Verträge",
      debt: "Schulden & Forderungen",
      inheritance: "Erben",
      criminalProcedure: "Strafverfahren",
      other: "Sonstiges",
    };

    descriptions.push({
      title: "Thema des Rechtsproblems:",
      text: bereichMapping[context.bereich],
    });
  }

  if (context.beschreibung) {
    descriptions.push({
      title: "Beschreibung Angelegenheit:",
      text: context.beschreibung,
    });
  }

  if (context.eigeninitiativeBeschreibung) {
    descriptions.push({
      title: "Eigenbemühungen:",
      text: context.eigeninitiativeBeschreibung,
    });
  } else if (context.keineEigeninitiativeBeschreibung) {
    descriptions.push({
      title: "Keine Eigenbemühung, weil:",
      text: context.keineEigeninitiativeBeschreibung,
    });
  }

  if (context.sonstiges) {
    descriptions.push({ title: "Weitere Anmerkung:", text: context.sonstiges });
  }

  return {
    shouldCreateNewPage:
      descriptions.map((x) => x.title + x.text).join(" ").length > 255,
    descriptions,
  };
};

function getSelectedOptions(
  mapping: { [key: string]: string },
  options?: { [key: string]: CheckboxValue },
) {
  if (!options) {
    return "";
  }

  return Object.entries(options)
    .map(([key, value]) => {
      if (value === CheckboxValue.on) {
        return mapping[key];
      }
      return "";
    })
    .filter((entry) => entry)
    .join(", ");
}

const getOccupationDetails = (
  context: BeratungshilfeAntragContext,
  withAdditionalIncome = true,
) => {
  const description: string[] = [];

  if (context.erwerbstaetig === "no") {
    description.push("nicht erwerbstätig");
  } else if (context.berufart) {
    const occupation = "Erwerbstätig";
    const occupationTypeSelected = getSelectedOptions(
      {
        selbststaendig: "selbstständig",
        festangestellt: "festangestellt",
      },
      context.berufart,
    );

    description.push(
      `${occupation}${
        occupationTypeSelected ? " (" + occupationTypeSelected + ")" : ""
      }`,
    );
  }

  const berufsituationMapping = {
    no: "",
    pupil: "Schüler:in",
    student: "Student:in",
    retiree: "Rentner:in",
  };

  description.push(berufsituationMapping[context.berufsituation ?? "no"]);

  if (context.weitereseinkommen && withAdditionalIncome) {
    const otherIncomes = getSelectedOptions(
      {
        unterhaltszahlungen: "Unterhaltszahlungen",
        wohngeld: "Wohngeld",
        kindergeld: "Kindergeld",
        bafoeg: "Bafög",
        others: "Sonstiges",
      },
      context.weitereseinkommen,
    );

    description.push(otherIncomes);
  }

  return description.filter((value) => value).join(", ");
};

export async function getBeratungshilfePdfFromContext(
  context: BeratungshilfeAntragContext,
) {
  const pdfFields = await getBeratungshilfeParameters();

  if (!pdfFields) {
    throw new Error("No pdf fields or file found for beratungshilfe!");
  }

  const hasStaatlicheLeistung =
    context.staatlicheLeistungen != "andereLeistung" &&
    context.staatlicheLeistungen != "keine";
  const staatlicheLeistungMapping = {
    grundsicherung: "Grundsicherung",
    asylbewerberleistungen: "Asylbewerberleistungen",
    buergergeld: "Bürgergeld",
    andereLeistung: "Andere Leistung",
    keine: "Keine",
  };

  fillCommonPDFFields(pdfFields, context);

  fillPersonalData(
    context,
    pdfFields,
    hasStaatlicheLeistung,
    staatlicheLeistungMapping,
  );

  fillFinancial(pdfFields, context);

  const attachment = isANewAttachmentPageNeeded(context);

  if (attachment.shouldCreateNewPage) {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      "Bitte im Anhang prüfen";
  } else {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      attachment.descriptions.map((x) => `${x.title} ${x.text} `).join("\n");
  }

  if (
    !hasStaatlicheLeistung &&
    (pdfFields.berufErwerbstaetigkeit.value?.length ?? 0) > 30
  ) {
    attachment.shouldCreateNewPage = true;
    attachment.descriptions.unshift({
      title: "Weiteres Einkommen:",
      text: getSelectedOptions(
        {
          unterhaltszahlungen: "Unterhaltszahlungen",
          wohngeld: "Wohngeld",
          kindergeld: "Kindergeld",
          bafoeg: "Bafög",
          others: "Sonstiges",
        },
        context.weitereseinkommen ?? {},
      ),
    });
    attachment.descriptions.unshift({
      title: "Beruf / Erwerbstätigkeit:",
      text: getOccupationDetails(context, false),
    });
    pdfFields.berufErwerbstaetigkeit.value = "Bitte im Anhang prüfen";
  }

  fillPartner(context, pdfFields);

  return fillOutBeratungshilfe(
    pdfFields,
    attachment.descriptions,
    attachment.shouldCreateNewPage,
  );
}

function fillCommonPDFFields(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeAntragContext,
) {
  pdfFields.bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein.value =
    context.rechtsschutzversicherung === "no";
  pdfFields.b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden.value =
    context.beratungshilfeBeantragt === "no";
  pdfFields.b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen.value =
    context.eigeninitiativeGrundvorraussetzung === "no";
  pdfFields.b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt.value =
    context.klageEingereicht === "no";
  pdfFields.c2Einkuenftenetto.value = context.einkommen;
}

function fillPartner(
  context: BeratungshilfeAntragContext,
  pdfFields: BeratungshilfePDF,
) {
  if (
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes"
  ) {
    pdfFields.c3EinkuenftePartner.value = true;
    pdfFields.c4EinkuenftePartnernetto.value = context.partnerEinkommenSumme;
  } else if (
    context.partnerschaft === "yes" &&
    context.zusammenleben === "no" &&
    context.unterhalt === "yes"
  ) {
    pdfFields.e1Person1.value = [
      context.partnerVorname ?? "",
      context.partnerNachname ?? "",
    ].join(" ");
    pdfFields.e3Familienverhaeltnis.value = "Partner:in";
    pdfFields.e4Zahlung1.value = context.unterhaltsSumme;
  }
}

function fillPersonalData(
  context: BeratungshilfeAntragContext,
  {
    anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers,
    antragstellerNameVornameggfGeburtsname,
    berufErwerbstaetigkeit,
    geburtsdatumdesAntragstellers,
    tagsueberTelefonischerreichbarunterNummer,
  }: BeratungshilfePDF,
  hasStaatlicheLeistung: boolean,
  staatlicheLeistungMapping: {
    grundsicherung: string;
    asylbewerberleistungen: string;
    buergergeld: string;
    andereLeistung: string;
    keine: string;
  },
) {
  antragstellerNameVornameggfGeburtsname.value = [
    context.nachname,
    context.vorname,
  ]
    .filter((entry) => entry)
    .join(", ");
  geburtsdatumdesAntragstellers.value = context.geburtsdatum;
  anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value = [
    context.strasseHausnummer,
    context.plz,
    context.ort,
  ]
    .filter((entry) => entry)
    .join(", ");
  tagsueberTelefonischerreichbarunterNummer.value = context.telefonnummer;
  berufErwerbstaetigkeit.value = hasStaatlicheLeistung
    ? staatlicheLeistungMapping[context.staatlicheLeistungen ?? "keine"]
    : getOccupationDetails(context);
}

function fillFinancial(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeAntragContext,
) {
  fillFinancialBankkonto(pdfFields, context);

  const hasGrundeigentum = context.grundeigentum
    ? context.grundeigentum?.length > 0
    : false;
  const hasGrundeigentumBewohnt = context.grundeigentumBewohnt
    ? context.grundeigentumBewohnt?.length > 0
    : false;

  pdfFields.f5Grundeigentum1.value =
    !hasGrundeigentum && !hasGrundeigentumBewohnt;
  pdfFields.f5Grundeigentum2.value =
    hasGrundeigentum || hasGrundeigentumBewohnt;

  const hasKraftfahrzeug = context.bankkonten
    ? context.bankkonten?.length > 0
    : false;
  pdfFields.f9Kraftfahrzeug1.value = !hasKraftfahrzeug;
  pdfFields.f9Kraftfahrzeuge2.value = hasKraftfahrzeug;

  const hasWertsachen = context.wertsachen
    ? context.wertsachen?.length > 0
    : false;
  pdfFields.f13Vermoegenswerte1.value = !hasWertsachen;
  pdfFields.f13Vermoegenswerte1.value = hasWertsachen;
}
const eigentuemerMapping = {
  myself: "Ich alleine",
  partner: "Ehe-Partner:in",
  myselfAndPartner: "Mein:e Ehe-Partner:in und ich gemeinsam",
  myselfAndSomeoneElse: "Ich gemeinsam mit jemand anderem",
};

function fillFinancialBankkonto(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeAntragContext,
) {
  const hasBankkonten = context.bankkonten
    ? context.bankkonten?.length > 0
    : false;
  pdfFields.f1Konten1.value = !hasBankkonten;
  pdfFields.f1Konten2.value = hasBankkonten;

  if (context.bankkonten && context.bankkonten.length == 1) {
    const bankkonto = context.bankkonten.pop();

    pdfFields.f1InhaberA.value = bankkonto?.kontoEigentuemer == "myself";
    pdfFields.f2InhaberB.value = bankkonto?.kontoEigentuemer == "partner";
    pdfFields.f2InhaberC.value =
      bankkonto?.kontoEigentuemer == "myselfAndPartner";

    const bezeichnung = [];
    if (bankkonto?.bankName) {
      bezeichnung.push(`Bank: ${bankkonto.bankName}`);
    }

    if (
      bankkonto?.kontoEigentuemer &&
      eigentuemerMapping[bankkonto?.kontoEigentuemer]
    ) {
      bezeichnung.push(
        `Eigentümer:in: ${eigentuemerMapping[bankkonto?.kontoEigentuemer]}`,
      );
    }

    pdfFields.f3Bank1.value = bezeichnung.join(", ");
  }
}

export async function getBeratungshilfeParameters() {
  const json: { [key: string]: StringField | BooleanField } = {};
  await PDFDocument.load(getBeratungshilfePdfBuffer()).then((pdfDoc) => {
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    fields.forEach((field) => {
      const fieldName = normalizePropertyName(field.getName());

      const textField = field as PDFTextField;
      if (field instanceof PDFTextField) {
        json[fieldName] = {
          name: field.getName(),
          value: textField.getText(),
        } as StringField;
      }

      const booleanField = field as PDFCheckBox;
      if (field instanceof PDFCheckBox) {
        json[fieldName] = {
          name: field.getName(),
          value: booleanField.isChecked(),
        } as BooleanField;
      }
    });
  });

  return Convert.toBeratungshilfePDF(JSON.stringify(json));
}

async function handleOutOfLimitDescription(
  descriptions: { title: string; text: string }[],
  pdfDoc: PDFDocument,
) {
  const stream = await renderToStream(
    <FormAttachment descriptions={descriptions} />,
  );

  const PDFAttachmentAsBuffer: Buffer = await new Promise((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    stream.on("data", (data: Uint8Array) => {
      buffers.push(data);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", reject);
  });

  const PDFAttachment = await PDFDocument.load(PDFAttachmentAsBuffer);
  const pages = PDFAttachment.getPages();

  for (let index = 0; index < pages.length; index++) {
    const [PDFAttachmentAsCopy] = await pdfDoc.copyPages(PDFAttachment, [
      index,
    ]);
    pdfDoc.insertPage(3 + index, PDFAttachmentAsCopy);
  }
  return pdfDoc.save();
}

export async function fillOutBeratungshilfe(
  values: BeratungshilfePDF,
  descriptions: { title: string; text: string }[],
  shouldCreateNewPage: boolean,
) {
  return await PDFDocument.load(getBeratungshilfePdfBuffer()).then((pdfDoc) => {
    const form = pdfDoc.getForm();

    Object.entries(values).forEach(([, value]) => {
      // When value is a BooleanField
      const booleanField = value as BooleanField;
      if (!changeBooleanField(booleanField, form)) {
        // When value is a StringField
        const stringField = value as StringField;
        changeStringField(stringField, form);
      }
    });

    if (shouldCreateNewPage) {
      return handleOutOfLimitDescription(descriptions, pdfDoc);
    }

    return pdfDoc.save();
  });
}

function changeBooleanField(field: BooleanField, form: PDFForm) {
  // When value is a BooleanField
  const booleanField = field;
  if (booleanField) {
    const field = form.getField(booleanField.name ?? "");
    if (field instanceof PDFCheckBox) {
      const checkBox = field;
      checkBox.uncheck();
      if (booleanField.value) {
        checkBox.check();
      }
      return true;
    }
  }
  return false;
}

function changeStringField(field: StringField, form: PDFForm) {
  const stringField = field;
  if (stringField) {
    const field = form.getField(stringField.name ?? "");
    if (field instanceof PDFTextField) {
      const textField = field;
      if (textField) {
        textField.setText(stringField.value);
        textField.setFontSize(10);
        return true;
      }
    }
  }
  return false;
}

// Caching file read, decryption & parsing to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line no-var
  var __beratungshilfeBuffer: ArrayBuffer | undefined; // NOSONAR
}

// Singleton to prevent multiple file reads
function getBeratungshilfePdfBuffer(): ArrayBuffer {
  if (!global.__beratungshilfeBuffer) {
    try {
      const file = path.resolve(
        path.join(
          process.cwd(),
          "app/services/pdf/beratungshilfe/Antrag_auf_Bewilligung_von_Beratungshilfe.pdf",
        ),
      );
      global.__beratungshilfeBuffer = fs.readFileSync(file);
    } catch (error) {
      console.error(error);
      return ArrayBuffer.prototype;
    }
  }

  return global.__beratungshilfeBuffer ?? ArrayBuffer.prototype;
}
