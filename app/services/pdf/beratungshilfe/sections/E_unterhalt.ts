import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { DescriptionField } from "../descriptionField";

export function fillUnterhalt(
  descriptionField: DescriptionField,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  if (
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

    descriptionField.shouldCreateAttachment = true;

    const description = getUnerhaltDescription(
      context.partnerVorname,
      context.partnerNachname,
      context.unterhaltsSumme,
      context.zusammenleben,
    );

    descriptionField.descriptions.unshift({
      title: "Unterhalt",
      text: description.join("\n\n"),
    });
  }
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
