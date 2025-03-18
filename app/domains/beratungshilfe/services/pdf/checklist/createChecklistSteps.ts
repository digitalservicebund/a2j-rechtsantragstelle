import type PDFDocument from "pdfkit";
import {
  beratungshilfeFormular,
  type BeratungshilfeFormularContext,
} from "~/domains/beratungshilfe/formular";
import { abgabeContext } from "~/domains/shared/formular/abgabe/context";
import { createHeading } from "~/services/pdf/createHeading";
import { pdfStyles } from "~/services/pdf/pdfStyles";

const { stringReplacements } = beratungshilfeFormular;
type ReplacementKey = keyof ReturnType<typeof stringReplacements>;

const documents = {
  hasBuergergeld: "Ihren aktuellen Bürgergeld-Bescheid",
  hasBuergergeldOrNoSozialleistung: "Kontoauszüge der letzten 3 Monate",
  hasGrundsicherung:
    "Kopie Ihres aktuellen Bescheids über Grundsicherung oder Sozialhilfe",
  arbeitslosenGeld: "Kopie Ihres aktuellen Arbeitslosengeld-Bescheids",
  hasAsylbewerberleistungen:
    "Kopie Ihres aktuellen Bescheids über Asylbewerberleistungen",
  wohngeld: "Kopie Ihres aktuellen Wohngeld-Bescheids",
  bafoeg:
    "Kopie Ihres aktuellen Bescheids über Bafoeg- oder Ausbildungsförderung",
  krankengeld:
    "Kopie Ihres Bescheids über Kranken- oder Pflegegeld (wenn vorhanden)",
  elterngeld: "Kopie Ihres aktuellen Elterngeld-Bescheids",
  hasLebensversicherung:
    "Kopie des letzten Jahreskontoauszugs für Ihre Lebensversicherung",
  hasBausparvertrag:
    "Kopie des letzten Jahreskontoauszugs für Ihren Bausparvertrag",
  hasWertpapiere:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Wertpapier-Depot",
  hasGutenhabenKrypto:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Paypal-, Krypto- oder anderem Guthaben-Konto",
  hasGiroTagesSparkonto:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Giro-, Tagesgeld- oder Sparkonto",
  hasGrundeigentum: "Kopie des Grundbuchauszugs von Ihrem Grundeigentum",
  hasSchwangerschaft: "Angabe des voraussichtlichen Entbindungstermins",
  hasSchwerbehinderung:
    "Kopie des Schwerbehindertenausweises, oder Nachweis über die Behinderung",
  hasMedicalReasons:
    "Bescheinigung der medizinischen Notwendigkeit der kostenaufwändigen Ernährung",
  hasWeitereAusgaben:
    "Unterlagen, die Ihre Ausgaben belegen, wenn diese nicht auf den Kontoauszügen zu sehen sind",
} as const satisfies Partial<Record<ReplacementKey, string>>;

type Step = {
  title: string;
  value: string | ((validAmtsgericht: boolean) => string);
};

export const dynamicSteps: Record<string, Step[]> = {
  [abgabeContext.abgabeArt.Enum.ausdrucken]: [
    { title: "Antrag ausdrucken", value: "" },
    {
      title: "Antrag unterschreiben",
      value:
        "Unterschreiben Sie den fertigen Antrag auf der letzten Seite im Feld “Unterschrift des Antragstellers/der Antragstellerin”",
    },
    {
      title: "Benötigte Dokumente kopieren",
      value: "Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:",
    },
    {
      title: "Antrag abgeben",
      value: (validAmtsgericht) =>
        `Sie können den Antrag direkt im Amtsgericht abgeben oder per Post schicken. ${validAmtsgericht ? "Die Adresse des zuständigen Amtsgericht finden Sie auf der ersten Seite des Antrags im Adressfeld." : "Ihr zuständiges Amtsgericht finden Sie über den Service “Amtsgericht finden” auf https://service.justiz.de/beratungshilfe."}`,
    },
  ],
  [abgabeContext.abgabeArt.Enum.online]: [
    {
      title: "Antrag prüfen und speichern",
      value:
        "Sie müssen den Antrag nicht unterschreiben, da Sie sich später mit Ihrem BundID Konto anmelden.",
    },
    {
      title: "Benötigte Dokumente scannen",
      value: "Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:",
    },
    {
      title: "Antrag über das Portal Mein Justizpostfach versenden",
      value:
        "Melden Sie sich mit Ihrem BundID Konto bei Mein Justizpostfach an. Dort können Sie alle Unterlagen hochladen und versenden. Mein Justizpostfach finden Sie hier: https://ebo.bund.de",
    },
  ],
};

export const createChecklistSteps = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: BeratungshilfeFormularContext,
) => {
  const conditions = stringReplacements(userData);

  const relevantDocuments = [
    "Unterlagen zu Ihrem rechtlichen Problem",
    ...Object.keys(documents)
      .filter((key) => conditions[key as ReplacementKey])
      .map((key) => documents[key as keyof typeof documents]),
  ] as const;

  const steps = dynamicSteps[userData.abgabeArt ?? "ausdrucken"];
  const insertIndex = steps.length - 1;
  const firstPart = steps.slice(0, insertIndex);
  const secondPart = steps.slice(insertIndex);
  const combinedSteps = [...firstPart, null, ...secondPart];
  const length = combinedSteps.length;

  // The actual checklist should always sit between last and second last step
  for (let index = 0; index < length; index++) {
    const step = combinedSteps[index];

    if (step) {
      createHeading(
        doc,
        documentStruct,
        `${index === length - 1 ? length - 1 : index + 1}. ${step.title}`,
        "H3",
      );
      documentStruct.add(
        doc.struct("P", {}, () => {
          doc
            .moveUp(0.5)
            .fontSize(pdfStyles.page.fontSize)
            .font(pdfStyles.page.font)
            .text(
              typeof step.value === "string"
                ? step.value
                : step.value(Boolean(conditions.courtName)),
              doc.x + pdfStyles.sectionIndented.paddingLeft,
              doc.y,
            )
            // workaround, because pdfkit only supports indentation for the first line of a paragraph
            .text("", doc.x - pdfStyles.sectionIndented.paddingLeft, doc.y)
            .moveDown(1);
        }),
      );
    }

    if (index === steps.length - 1) {
      documentStruct.add(
        doc.struct("L", {}, () => {
          doc
            .fontSize(pdfStyles.page.fontSize)
            .font(pdfStyles.page.font)
            .list(
              relevantDocuments.map((doc) => doc),
              doc.x + pdfStyles.sectionIndented.paddingLeft,
              doc.y,
              {
                paragraphGap: 8,
                // the value of bulletIdent does not seem to have any effect
                bulletIndent: pdfStyles.list.paddingLeft,
              },
            )
            .text("", doc.x - pdfStyles.sectionIndented.paddingLeft, doc.y);
        }),
      );
    }
  }
};
