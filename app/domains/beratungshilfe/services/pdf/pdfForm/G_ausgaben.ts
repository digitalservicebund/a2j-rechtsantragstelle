import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFinanzielleAngaben } from "~/domains/beratungshilfe/formular/finanzielleAngaben/context";
import type { besondereBelastungenSchema } from "~/domains/shared/formular/finanzielleAngaben/context";
import {
  type AttachmentEntries,
  SEE_IN_ATTACHMENT_DESCRIPTION,
} from "~/domains/shared/services/pdf/attachment";
import { checkboxListToString } from "~/services/pdf/checkboxListToString";
import type { BerHPdfFillFunction } from "..";

const AUSGABEN_MAX_COUNT_FIELDS = 4;
const AUSGABEN_MAX_CHARS_FIELD = 19;
export const AUSGABEN_ATTACHMENT_TITLE =
  "Feld G: Zahlungsverpflichtungen und besondere Belastungen";

export const ausgabenSituationMapping = {
  pregnancy: "Schwangerschaft",
  singleParent: "Alleinerziehend",
  disability: "Schwerbehinderung",
  medicalReasons:
    "Kostenaufwändige Ernährung notwendig durch medizinische Gründe",
} satisfies Record<keyof typeof besondereBelastungenSchema.shape, string>;

export const fillAusgaben: BerHPdfFillFunction = ({ userData, pdfValues }) => {
  const attachment: AttachmentEntries = [];
  const ausgaben = userData.ausgaben ?? [];
  const hasOverflowAusgaben = ausgaben.length > AUSGABEN_MAX_COUNT_FIELDS;

  const isPdfFieldExceedsMaxChars = ausgaben.some(
    (ausgabe) =>
      ausgabe.art &&
      ausgabe.zahlungsempfaenger &&
      (ausgabe.art.length > AUSGABEN_MAX_CHARS_FIELD ||
        ausgabe.zahlungsempfaenger.length > AUSGABEN_MAX_CHARS_FIELD),
  );

  pdfValues.g1VerpflichtungenJ.value = userData.hasAusgaben === "yes";
  pdfValues.g1VerpflichtungenN.value = userData.hasAusgaben === "no";

  const { ausgabensituation } = userData;
  const belastungen = Object.values(ausgabensituation ?? {});
  const hasBesondereBelastung = belastungen.some((value) => value === "on");
  const noBesondereBelastung = !hasBesondereBelastung && belastungen.length > 0;

  pdfValues.g9SonstigeBelastungenJ.value = hasBesondereBelastung;
  pdfValues.g9SonstigeBelastungenN.value = noBesondereBelastung;
  if (hasBesondereBelastung) {
    pdfValues.g10Belastungen.value = checkboxListToString(
      ausgabenSituationMapping,
      userData.ausgabensituation,
    );
  }

  if (isPdfFieldExceedsMaxChars || hasOverflowAusgaben) {
    pdfValues.g21.value = SEE_IN_ATTACHMENT_DESCRIPTION;
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
    fillAusgabenInPDF(ausgaben, pdfValues);
  }
  return { pdfValues, attachment };
};

function fillAusgabenInPDF(
  ausgaben: NonNullable<BeratungshilfeFinanzielleAngaben["ausgaben"]>,
  pdfValues: BeratungshilfePDF,
) {
  for (let i = 0; i < ausgaben.length; i++) {
    const ausgabe = ausgaben[i];
    const index = i + 1;

    const artKey = `g2${index}` as keyof BeratungshilfePDF;
    const zahlungsempfaengerKey = `g3${index}` as keyof BeratungshilfePDF;
    const zahlungsfristKey = `g5Raten${index}` as keyof BeratungshilfePDF;
    const beitragKey = `g7Zahlung${index}` as keyof BeratungshilfePDF;
    const hasFrist = ausgabe?.hasZahlungsfrist === "yes";

    if (artKey in pdfValues) {
      pdfValues[artKey].value = ausgabe.art;
    }
    if (zahlungsempfaengerKey in pdfValues) {
      pdfValues[zahlungsempfaengerKey].value = ausgabe.zahlungsempfaenger;
    }
    if (hasFrist && zahlungsfristKey in pdfValues) {
      pdfValues[zahlungsfristKey].value = ausgabe.zahlungsfrist;
    }
    if (beitragKey in pdfValues) {
      pdfValues[beitragKey].value = ausgabe.beitrag;
    }
  }
}
