import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { type Attachment, newPageHint } from "../attachment";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { checkboxListToString } from "../../checkboxListToString";

const AUSGABEN_MAX_FIELDS = 4;

type AusgabenPdfField = {
  art: string;
  zahlungsempfaenger: string;
  beitrag: string;
  hasZahlungsfrist: string;
  zahlungsfrist: string;
};

const ausgabenSituationMapping = {
  pregnancy: "Schwangerschaft",
  singleParent: "Alleinerziehend",
  disability: "Schwerbehinderung",
  medicalReasons:
    "Kostenaufwändige Ernährung notwendig durch medizinische Gründe",
};

export function fillAusgaben(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const ausgaben = context.ausgaben ?? [];

  if (ausgaben.length > AUSGABEN_MAX_FIELDS) {
    handleOverflowAusgaben(attachment, pdfFields, context, ausgaben);
  } else {
    fillAusgabenInPDF(ausgaben, pdfFields);
    fillBelastungenInPDF(context, pdfFields);
  }
}

function handleOverflowAusgaben(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
  ausgaben: AusgabenPdfField[],
) {
  attachment.shouldCreateAttachment = true;
  pdfFields.g21.value = newPageHint;

  attachment.descriptions.push({
    title: "Feld G Zahlungsverpflichtungen und besondere Belastungen",
    text: createAusgabenText(context, ausgaben),
  });
}

function createAusgabenText(
  context: BeratungshilfeFormularContext,
  ausgaben: AusgabenPdfField[],
) {
  let attachmentText = "";

  const checkboxInput = checkboxListToString(
    ausgabenSituationMapping,
    context.ausgabensituation,
  );

  const ausgabenSituationTitle =
    checkboxInput !== "" ? "Besondere Belastungen\n" : "";

  attachmentText += `Ausgaben\n\n`;
  attachmentText += generateAusgabenList(ausgaben);
  attachmentText += "\n\n";
  attachmentText += ausgabenSituationTitle;
  attachmentText += checkboxInput;

  return attachmentText;
}

function generateAusgabenList(ausgaben: AusgabenPdfField[]) {
  const description = [];

  for (let i = 0; i < ausgaben.length; i++) {
    description.push(`\nAusgabe ${i + 1}:`);
    description.push(`Art der Ausgabe: ${ausgaben[i].art}`);
    description.push(`Zahlungsempfänger: ${ausgaben[i].zahlungsempfaenger}`);
    description.push(`Monatliche Zahlung: ${ausgaben[i].beitrag}`);
    if (ausgaben[i].zahlungsfrist) {
      description.push(`Raten laufen bis: ${ausgaben[i].zahlungsfrist}`);
    }
  }

  return description.join("\n");
}

function fillBelastungenInPDF(
  context: BeratungshilfeFormularContext,
  pdfFields: BeratungshilfePDF,
) {
  pdfFields.g10Belastungen.value = checkboxListToString(
    ausgabenSituationMapping,
    context.ausgabensituation,
  );
}

function fillAusgabenInPDF(
  ausgaben: AusgabenPdfField[],
  pdfFields: BeratungshilfePDF,
) {
  for (let i = 0; i < ausgaben.length; i++) {
    const ausgabe = ausgaben[i];
    const index = i + 1;

    const artKey = `g2${index}` as keyof BeratungshilfePDF;
    const zahlungsempfaengerKey = `g3${index}` as keyof BeratungshilfePDF;
    const zahlungsfristKey = `g5Raten${index}` as keyof BeratungshilfePDF;
    const beitragKey = `g7Zahlung${index}` as keyof BeratungshilfePDF;
    const hasFrist = ausgabe?.hasZahlungsfrist === "yes";

    if (artKey in pdfFields) {
      pdfFields[artKey].value = ausgabe.art;
    }
    if (zahlungsempfaengerKey in pdfFields) {
      pdfFields[zahlungsempfaengerKey].value = ausgabe.zahlungsempfaenger;
    }
    if (hasFrist && zahlungsfristKey in pdfFields) {
      pdfFields[zahlungsfristKey].value = ausgabe.zahlungsfrist;
    }
    if (beitragKey in pdfFields) {
      pdfFields[beitragKey].value = ausgabe.beitrag;
    }
  }
}
