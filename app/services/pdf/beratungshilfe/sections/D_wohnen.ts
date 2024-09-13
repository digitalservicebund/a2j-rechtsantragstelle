import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import type { AttachmentEntries } from "../../attachment";

export function fillWohnen(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  pdfFields.d1Wohnung.value = context.apartmentSizeSqm?.toString();
  pdfFields.d2Wohnkosten.value =
    context.apartmentCostAlone ?? context.apartmentCostFull;

  if (context.apartmentCostOwnShare) {
    pdfFields.d3Teilwohnkosten.value = "su";
    attachment.push(
      { title: "Feld D: Wohnen", level: "h2" },
      {
        title: "Wohnungsgröße",
        text: context.apartmentSizeSqm?.toString() + " m²",
      },
      {
        title: "Wohnungskosten gesamt (monatlich)",
        text: context.apartmentCostFull + " €",
      },
      {
        title: "Eigene Wohnungskosten (monatlich)",
        text: context.apartmentCostOwnShare + " €",
      },
      {
        title: "Anzahl weiterer Personen in Wohnung",
        text: context.apartmentPersonCount?.toString(),
      },
    );
  }

  const livesAlone = context.livingSituation === "alone";
  pdfFields.d4Wohnungalleine.value = livesAlone;
  pdfFields.d5Wohnunggemeinsam.value = !livesAlone;
  pdfFields.d6WonungweiterePersonen.value =
    context.apartmentPersonCount?.toString();
}
