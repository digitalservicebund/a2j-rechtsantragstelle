import { z } from "zod";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const hasKontopfaendung = z.enum(
  ["nein", "ja", "weissNicht"],
  customRequiredErrorMessage,
);

export const hasPKonto = z.enum(
  ["nein", "ja", "nichtAktiv", "bank"],
  customRequiredErrorMessage,
);

export const schuldenBei = z.enum(
  [
    "privat",
    "behoerden",
    "kredit",
    "krankenkasse",
    "rechnung",
    "beitragsservice",
    "unterhalt",
    "strafe",
    "finanzamt",
    "hauptzollamt",
    "nichtSagen",
    "weissNicht",
    "staatsanwaltschaft",
    "kasse",
    "jugendamt",
  ],
  customRequiredErrorMessage,
);

export const euroSchwelle = z.enum(
  ["nein", "ja", "weissNicht", "unterschiedlich"],
  customRequiredErrorMessage,
);

export const verheiratet = z.enum(
  ["nein", "ja", "getrennt", "geschieden", "verwitwet"],
  customRequiredErrorMessage,
);

export const kinderLebtMit = z.enum(
  ["nein", "ja", "teilweise"],
  customRequiredErrorMessage,
);

export const arbeitsweise = z.object({
  angestellt: checkedOptional,
  selbstaendig: checkedOptional,
});

export const zahlungArbeitgeber = z.object({
  urlaubsgeld: checkedOptional,
  weihnachtsgeld: checkedOptional,
  ueberstundenBezahlt: checkedOptional,
  abfindung: checkedOptional,
  anderes: checkedOptional,
  nein: checkedOptional,
});

export const hasSozialleistungen = z.enum(
  [
    "buergergeld",
    "grundsicherungSozialhilfe",
    "asylbewerberleistungen",
    "nein",
  ],
  customRequiredErrorMessage,
);

export const sozialleistungenUmstaende = z.object({
  pflegegeld: checkedOptional,
  kindergeld: checkedOptional,
  wohngeld: checkedOptional,
  nein: checkedOptional,
});

export const besondereAusgaben = z.object({
  erkrankungBehinderung: checkedOptional,
  KostenWegenHoherMiete: checkedOptional,
  weitere: checkedOptional,
  nein: checkedOptional,
});

export const pflegegeld = z.enum(
  ["selbst", "fremd"],
  customRequiredErrorMessage,
);

export const context = {
  hasKontopfaendung,
  hasPKonto,
  schuldenBei,
  euroSchwelle,
  hasKinder: YesNoAnswer,
  kinderLebtMit,
  verheiratet,
  kinderSupport: YesNoAnswer,
  partnerWohnenZusammen: YesNoAnswer,
  partnerSupport: YesNoAnswer,
  hasArbeit: YesNoAnswer,
  arbeitsweise,
  nachzahlungArbeitgeber: YesNoAnswer,
  arbeitgeberAmountHigherThan: YesNoAnswer,
  zahlungArbeitgeber,
  hasSozialleistungen,
  sozialleistungenUmstaende,
  hasSozialleistungNachzahlung: YesNoAnswer,
  socialAmountHigher500: YesNoAnswer,
  hasSozialleistungenEinmalzahlung: YesNoAnswer,
  besondereAusgaben,
  unerlaubtenHandlung: YesNoAnswer,
  unterhaltszahlungen: YesNoAnswer,
  pflegegeld,
} as const;

const _contextObject = z.object(context).partial();
export type KontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
