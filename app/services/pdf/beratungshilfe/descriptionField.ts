import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";

export class DescriptionField {
  newPageHint = "Bitte im Anhang prüfen";

  descriptions: { title: string; text: string }[] = [];
  shouldCreateAttachment = false;

  constructor(
    private context: BeratungshilfeFormularContext,
    private maxLength: number = 255,
  ) {
    if (this.context.bereich) {
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

      this.descriptions.push({
        title: "Thema des Rechtsproblems:",
        text: bereichMapping[this.context.bereich],
      });
    }

    if (this.context.beschreibung) {
      this.descriptions.push({
        title: "Beschreibung Angelegenheit:",
        text: this.context.beschreibung,
      });
    }

    if (this.context.eigeninitiativeBeschreibung) {
      this.descriptions.push({
        title: "Eigenbemühungen:",
        text: this.context.eigeninitiativeBeschreibung,
      });
    } else if (this.context.keineEigeninitiativeBeschreibung) {
      this.descriptions.push({
        title: "Keine Eigenbemühung, weil:",
        text: this.context.keineEigeninitiativeBeschreibung,
      });
    }

    if (this.context.sonstiges) {
      this.descriptions.push({
        title: "Weitere Anmerkung:",
        text: this.context.sonstiges,
      });
    }
  }

  addDescription(title: string, text: string) {
    this.descriptions.push({ title, text });

    // If the descriptions field is too long, we should add a new attachment page
    if (
      this.descriptions.map((x) => x.title + x.text).join(" ").length >
      this.maxLength
    ) {
      this.shouldCreateAttachment = true;
    }
  }

  getAttachment(pdfFields: BeratungshilfePDF) {
    pdfFields.berufErwerbstaetigkeit.value = this.newPageHint;
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      this.newPageHint;
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      this.newPageHint;
    pdfFields.f3Bank1.value = this.newPageHint;
  }
}
