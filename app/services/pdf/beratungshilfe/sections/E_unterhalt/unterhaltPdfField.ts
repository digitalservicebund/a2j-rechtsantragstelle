import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import type { Unterhaltszahlung } from "~/flows/shared/finanzielleAngaben/context";
import { arrayIsNonEmpty } from "~/util/array";

type FamilienverhaeltnisUnterhaltPdfField =
  | "Mein Kind"
  | "Partner:in"
  | "Meine Mutter"
  | "Mein Vater"
  | "Meine Großmutter"
  | "Mein Großvater"
  | "Mein Enkelkind"
  | "Meine Ex-Ehepartnerin"
  | "Mein Ex-Ehepartner";

export type UnterhaltPdfField = {
  name: string;
  geburtsdatum?: string;
  familienverhaeltnis: FamilienverhaeltnisUnterhaltPdfField;
  unterhaltSumme?: string;
  hatEinnahmen: boolean;
  einnahmenSumme?: string;
  lebenZusammen?: boolean;
};

export function getListPersonUnterhaltPdfField(
  context: BeratungshilfeFormularContext,
): UnterhaltPdfField[] {
  const listPartnerUnterhaltPdfField: UnterhaltPdfField[] = [];

  if (context.partnerschaft === "yes" && context.unterhalt === "yes") {
    listPartnerUnterhaltPdfField.push({
      name: `${context.partnerVorname ?? ""} ${context.partnerNachname ?? ""}`,
      familienverhaeltnis: "Partner:in",
      unterhaltSumme: context.unterhaltsSumme,
      hatEinnahmen: context.partnerEinkommen === "yes",
      einnahmenSumme: context.partnerEinkommen,
      lebenZusammen: context.zusammenleben === "yes",
    });
  }

  if (
    context.hasWeitereUnterhaltszahlungen === "yes" &&
    arrayIsNonEmpty(context.unterhaltszahlungen)
  ) {
    const unterhaltszahlungPdfFileds: UnterhaltPdfField[] =
      context.unterhaltszahlungen.map((unterhaltszahlung) => ({
        name: `${unterhaltszahlung.firstName ?? ""} ${unterhaltszahlung.surname ?? ""}`,
        familienverhaeltnis:
          getFamilienverhaeltnisByUnterhaltszahlung(unterhaltszahlung),
        unterhaltSumme: unterhaltszahlung.monthlyPayment,
        hatEinnahmen: false,
        einnahmenSumme: "",
        lebenZusammen: true, // For these Unterhaltszahlungen, it is irrelvant, if the people live together.
        geburtsdatum: unterhaltszahlung.birthday,
      }));

    listPartnerUnterhaltPdfField.push(...unterhaltszahlungPdfFileds);
  }

  return listPartnerUnterhaltPdfField;
}

function getFamilienverhaeltnisByUnterhaltszahlung({
  familyRelationship,
}: Unterhaltszahlung): FamilienverhaeltnisUnterhaltPdfField {
  switch (familyRelationship) {
    case "mother":
      return "Meine Mutter";
    case "father":
      return "Mein Vater";
    case "grandmother":
      return "Meine Großmutter";
    case "grandfather":
      return "Mein Großvater";
    case "kid":
      return "Mein Kind";
    case "ex-spouse-f":
      return "Meine Ex-Ehepartnerin";
    case "ex-spouse-m":
      return "Mein Ex-Ehepartner";
    case "grandchild":
      return "Mein Enkelkind";
    default:
      return "Partner:in";
  }
}

export function getListKidsUnterhaltPdfField(
  context: BeratungshilfeFormularContext,
): UnterhaltPdfField[] {
  return context.kinder
    ? context.kinder.map((kind) => ({
        name: `${kind.vorname ?? ""} ${kind.nachname ?? ""}`,
        geburtsdatum: kind.geburtsdatum,
        familienverhaeltnis: "Mein Kind",
        unterhaltSumme: kind.unterhaltsSumme,
        hatEinnahmen: kind.eigeneEinnahmen === "yes",
        einnahmenSumme: kind.einnahmen,
        lebenZusammen: kind.wohnortBeiAntragsteller === "yes",
      }))
    : [];
}
