import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { type AttachmentEntries, newPageHint } from "~/services/pdf/attachment";
import { eigentuemerMapping } from "../../eigentuemerMapping";

const geldanlageArtMapping: Record<string, string> = {
  bargeld: "Bargeld",
  wertpapiere: "Wertpapiere",
  guthabenkontoKrypto: "Guthabenkonto oder Kryptowährung",
  giroTagesgeldSparkonto: "Girokonto / Tagesgeld / Sparkonto",
  befristet: "Befristete Geldanlage",
  forderung: "Forderung",
  sonstiges: "Sonstiges",
};
const befristungMapping = {
  lifeInsurance: "Lebensversicherung",
  buildingSavingsContract: "Bausparvertrag",
  fixedDepositAccount: "Festgeldkonto",
};

function fillSingleVermoegenswert(
  vermoegenswert: NonNullable<BeratungshilfeFormularContext["geldanlagen"]>[0],
) {
  let description =
    vermoegenswert.art in geldanlageArtMapping
      ? `Art: ${geldanlageArtMapping[vermoegenswert.art]}`
      : vermoegenswert.art;
  if (vermoegenswert.eigentuemer === "myselfAndSomeoneElse")
    description += `, Eigentümer:in: ${eigentuemerMapping[vermoegenswert.eigentuemer]}`;

  if (vermoegenswert.auszahlungdatum)
    description += `, Auszahlungsdatum: ${vermoegenswert.auszahlungdatum}`;
  if (vermoegenswert.befristetArt)
    description += `, Art der Befristung: ${befristungMapping[vermoegenswert.befristetArt]}`;
  if (vermoegenswert.verwendungszweck)
    description += `, Verwendungszweck: ${vermoegenswert.verwendungszweck}`;
  if (vermoegenswert.forderung)
    description += `, Forderung: ${vermoegenswert.forderung}`;
  if (vermoegenswert.kontoBezeichnung)
    description += `, Bezeichnung: ${vermoegenswert.kontoBezeichnung}`;
  if (vermoegenswert.kontoBankName)
    description += `, Name der Bank: ${vermoegenswert.kontoBankName}`;
  if (vermoegenswert.kontoIban)
    description += `, IBAN: ${vermoegenswert.kontoIban}`;
  return description;
}

export function fillVermoegenswerte(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const wertsachen = context.wertsachen ?? [];
  const geldanlagen = context.geldanlagen ?? [];
  const totalVermoegenswerteCount = wertsachen.length + geldanlagen.length;

  const hasVermoegenswerte = totalVermoegenswerteCount > 0;
  pdfFields.f13Vermoegenswerte1.value = !hasVermoegenswerte;
  pdfFields.f13Vermoegenswerte2.value = hasVermoegenswerte;

  if (!hasVermoegenswerte) return;

  if (totalVermoegenswerteCount == 1) {
    const vermoegenswert = geldanlagen[0] ?? wertsachen[0];

    pdfFields.f14InhaberA.value = vermoegenswert.eigentuemer == "myself";
    pdfFields.f14InhaberB.value = vermoegenswert.eigentuemer == "partner";
    pdfFields.f14VermoegenswerteC.value =
      vermoegenswert.eigentuemer == "myselfAndPartner";

    pdfFields.f15Bezeichnung.value = fillSingleVermoegenswert(vermoegenswert);
    pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value =
      vermoegenswert.wert;
  } else {
    pdfFields.f15Bezeichnung.value = newPageHint;
    attachment.push({
      title: "Sonstige Vermögenswerte",
      level: "h3",
    });
    geldanlagen.forEach((geldanlage, index) => {
      attachment.push(
        { title: `Geldanlage ${index + 1}`, level: "h4" },
        { title: "Art", text: geldanlageArtMapping[geldanlage.art] },
        { title: "Wert", text: geldanlage.wert },
        {
          title: "Eigentümer:in",
          text: eigentuemerMapping[geldanlage.eigentuemer],
        },
      );
      if (geldanlage.auszahlungdatum)
        attachment.push({
          title: "Auszahlungsdatum",
          text: geldanlage.auszahlungdatum,
        });
      if (geldanlage.befristetArt)
        attachment.push({
          title: "Art der Befristung",
          text: befristungMapping[geldanlage.befristetArt],
        });
      if (geldanlage.forderung)
        attachment.push({ title: "Forderung", text: geldanlage.forderung });
      if (geldanlage.verwendungszweck)
        attachment.push({
          title: "Verwendungszweck",
          text: geldanlage.verwendungszweck,
        });
      if (geldanlage.kontoBankName)
        attachment.push({
          title: "Name der Bank",
          text: geldanlage.kontoBankName,
        });
      if (geldanlage.kontoBezeichnung)
        attachment.push({
          title: "Bezeichnung",
          text: geldanlage.kontoBezeichnung,
        });
      if (geldanlage.kontoIban)
        attachment.push({
          title: "IBAN",
          text: geldanlage.kontoIban,
        });
    });
    wertsachen.forEach((wertsache, index) => {
      attachment.push(
        { title: `Wertsache ${index + 1}`, level: "h4" },
        { title: "Art", text: wertsache.art },
        { title: "Wert", text: wertsache.wert },
        {
          title: "Eigentümer:in",
          text: eigentuemerMapping[wertsache.eigentuemer],
        },
      );
    });
  }
}
