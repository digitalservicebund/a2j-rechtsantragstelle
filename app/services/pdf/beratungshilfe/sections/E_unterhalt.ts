import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { DescriptionField } from "../descriptionField";

type UnterhaltPdfFields = {
  name: string;
  geburtsdatum: string;
  familienverhaeltnis: string;
  unterhaltSumme: string;
  hatEinnahmen: boolean;
  einnahmenSumme: string;
};

export function fillUnterhalt(
  descriptionField: DescriptionField,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const unterhaltPdfFields: UnterhaltPdfFields[] = [];

  if (context.partnerschaft === "yes" && context.unterhalt === "yes") {
    unterhaltPdfFields.push({
      name: [context.partnerVorname ?? "", context.partnerNachname ?? ""].join(
        " ",
      ),
      geburtsdatum: "", // FIXME: Geburtsdatum is not in the context
      familienverhaeltnis: "Partner:in",
      unterhaltSumme: context.unterhaltsSumme ?? "",
      hatEinnahmen: context.partnerEinkommen === "yes",
      einnahmenSumme: context.partnerEinkommen ?? "",
    });
  }

  if (context.kinder && context.kinder.length > 0) {
    context.kinder.forEach((kind) => {
      unterhaltPdfFields.unshift({
        name: [kind.vorname ?? "", kind.nachname ?? ""].join(" "),
        geburtsdatum: kind.geburtsdatum ?? "",
        familienverhaeltnis: "Kind",
        unterhaltSumme: kind.unterhaltsSumme ?? "",
        hatEinnahmen: kind.eigeneEinnahmen === "yes",
        einnahmenSumme: kind.einnahmen ?? "",
      });
    });
  }

  if (unterhaltPdfFields.length == 0) return;

  descriptionField.shouldCreateAttachment = true;

  const description: string[] = [];

  unterhaltPdfFields.forEach((unterhaltPdfField) => {
    description.push(
      getUnerhaltDescription(
        unterhaltPdfField.name,
        unterhaltPdfField.geburtsdatum,
        unterhaltPdfField.unterhaltSumme,
        context.zusammenleben,
      ).join("\n"),
    );
  });

  descriptionField.descriptions.unshift({
    title: "Unterhalt",
    text: description.join("\n\n"),
  });

  const person1 = unterhaltPdfFields.pop();
  if (!person1) return;
  fillPerson1(pdfFields, person1);

  const person2 = unterhaltPdfFields.pop();
  if (!person2) return;
  fillPerson2(pdfFields, person2);

  const person3 = unterhaltPdfFields.pop();
  if (!person3) return;
  fillPerson3(pdfFields, person3);

  const person4 = unterhaltPdfFields.pop();
  if (!person4) return;
  fillPerson4(pdfFields, person4);
}

function fillPerson1(
  pdfFields: BeratungshilfePDF,
  unterhaltPdfFields: UnterhaltPdfFields,
) {
  pdfFields.e1Person1.value = unterhaltPdfFields.name;
  pdfFields.e2Geburtsdatum.value = unterhaltPdfFields.geburtsdatum;
  pdfFields.e3Familienverhaeltnis.value =
    unterhaltPdfFields.familienverhaeltnis;
  pdfFields.e4Zahlung1.value = unterhaltPdfFields.unterhaltSumme;
  pdfFields.e5Einnahmen1.value = unterhaltPdfFields.hatEinnahmen;
}

function fillPerson2(
  pdfFields: BeratungshilfePDF,
  unterhaltPdfFields: UnterhaltPdfFields,
) {
  pdfFields.e1Person2.value = unterhaltPdfFields.name;
  pdfFields.e2Geburtsdatum2.value = unterhaltPdfFields.geburtsdatum;
  pdfFields.e3Familienverhaeltnis2.value =
    unterhaltPdfFields.familienverhaeltnis;
  pdfFields.e4Zahlung2.value = unterhaltPdfFields.unterhaltSumme;
  pdfFields.e5Einnahmen2.value = unterhaltPdfFields.hatEinnahmen;
}

function fillPerson3(
  pdfFields: BeratungshilfePDF,
  unterhaltPdfFields: UnterhaltPdfFields,
) {
  pdfFields.e1Person3.value = unterhaltPdfFields.name;
  pdfFields.e2Geburtsdatum3.value = unterhaltPdfFields.geburtsdatum;
  pdfFields.e3Familienverhaeltnis3.value =
    unterhaltPdfFields.familienverhaeltnis;
  pdfFields.e4Zahlung3.value = unterhaltPdfFields.unterhaltSumme;
  pdfFields.e5Einnahmen3.value = unterhaltPdfFields.hatEinnahmen;
}

function fillPerson4(
  pdfFields: BeratungshilfePDF,
  unterhaltPdfFields: UnterhaltPdfFields,
) {
  pdfFields.e1Person4.value = unterhaltPdfFields.name;
  pdfFields.e2Geburtsdatum4.value = unterhaltPdfFields.geburtsdatum;
  pdfFields.e3Familienverhaeltnis4.value =
    unterhaltPdfFields.familienverhaeltnis;
  pdfFields.e4Zahlung4.value = unterhaltPdfFields.unterhaltSumme;
  pdfFields.e5Einnahmen4.value = unterhaltPdfFields.hatEinnahmen;
}

function getUnerhaltDescription(
  partnerVorname?: string,
  partnerNachname?: string,
  unterhaltsSumme?: string,
  zusammenleben?: "yes" | "no",
) {
  const description = [];

  description.push(
    `Unterhalt für Partner:in ${partnerVorname ?? ""} ${partnerNachname ?? ""}`,
  );
  description.push(
    `Gemeinsame Wohnung: ${zusammenleben === "yes" ? "Ja" : "Nein"}`,
  );
  description.push(`Monatliche Summe: ${unterhaltsSumme ?? "Keine Angabe"} €`);

  return description;
}
