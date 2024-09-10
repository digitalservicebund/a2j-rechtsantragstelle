import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import type { besondereBelastungenSchema } from "~/flows/shared/finanzielleAngaben/context";
import { arrayIsNonEmpty } from "~/util/array";
import { type AttachmentEntries, newPageHint } from "../../attachment";
import { checkboxListToString } from "../../checkboxListToString";

const AUSGABEN_MAX_COUNT_FIELDS = 4;
const AUSGABEN_MAX_CHARS_FIELD = 19;
export const AUSGABEN_ATTACHMENT_TITLE =
  "Feld G: Zahlungsverpflichtungen und besondere Belastungen";

type AusgabenPdfField = {
  art: string;
  zahlungsempfaenger: string;
  beitrag: string;
  hasZahlungsfrist: string;
  zahlungsfrist: string;
};

export const ausgabenSituationMapping = {
  pregnancy: "Schwangerschaft",
  singleParent: "Alleinerziehend",
  disability: "Schwerbehinderung",
  medicalReasons:
    "Kostenaufwändige Ernährung notwendig durch medizinische Gründe",
} satisfies Record<keyof typeof besondereBelastungenSchema.shape, string>;

export function fillAusgaben(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const ausgaben = context.ausgaben ?? [];
  const hasOverflowAusgaben = ausgaben.length > AUSGABEN_MAX_COUNT_FIELDS;

  const isPdfFieldExceedsMaxChars = context.ausgaben?.some(
    (ausgabe) =>
      ausgabe.art.length > AUSGABEN_MAX_CHARS_FIELD ||
      ausgabe.zahlungsempfaenger.length > AUSGABEN_MAX_CHARS_FIELD,
  );

  const hasAusgaben = arrayIsNonEmpty(ausgaben);

  pdfFields.g1VerpflichtungenJ.value = hasAusgaben;
  pdfFields.g1VerpflichtungenN.value = !hasAusgaben;

  const { ausgabensituation } = context;
  const hasBesondereBelastung =
    ausgabensituation?.disability === "on" ||
    ausgabensituation?.medicalReasons === "on" ||
    ausgabensituation?.pregnancy === "on" ||
    ausgabensituation?.singleParent === "on";

  pdfFields.g9SonstigeBelastungenJ.value = hasBesondereBelastung;
  pdfFields.g9SonstigeBelastungenN.value = !hasBesondereBelastung;
  if (hasBesondereBelastung) {
    pdfFields.g10Belastungen.value = checkboxListToString(
      ausgabenSituationMapping,
      context.ausgabensituation,
    );
  }

  if (isPdfFieldExceedsMaxChars || hasOverflowAusgaben) {
    pdfFields.g21.value = newPageHint;
    attachment.push({ title: AUSGABEN_ATTACHMENT_TITLE, level: "h2" });
    ausgaben.forEach((ausgabe, index) => {
      attachment.push({
        title: `Ausgabe ${index + 1}`,
        level: "h3",
      });
      attachment.push({ title: "Art der Ausgabe", text: ausgabe.art });
      attachment.push({
        title: "Zahlungsempfänger",
        text: ausgabe.zahlungsempfaenger,
      });
      attachment.push({
        title: "Monatliche Zahlung in Euro",
        text: ausgabe.beitrag,
      });
      if (ausgabe.zahlungsfrist) {
        attachment.push({
          title: "Raten laufen bis",
          text: ausgabe.zahlungsfrist,
        });
      }
    });
  } else {
    fillAusgabenInPDF(ausgaben, pdfFields);
  }
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
