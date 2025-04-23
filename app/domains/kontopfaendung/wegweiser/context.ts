import { z } from "zod";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const hasKontopfaendung = z.enum(
  ["nein", "ja", "weissNicht"],
  customRequiredErrorMessage,
);

const hasPKonto = z.enum(
  ["nein", "ja", "nichtAktiv", "nichtEingerichtet"],
  customRequiredErrorMessage,
);

const schuldenBei = z.enum(
  [
    "privat",
    "behoerden",
    "kredit",
    "krankenkasse",
    "rechnung",
    "beitragsservice",
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

const sockelbetrag = z.enum(
  ["nein", "ja", "weissNicht", "unterschiedlich"],
  customRequiredErrorMessage,
);

const kinderWohnenZusammen = z.enum(
  ["nein", "ja", "teilweise"],
  customRequiredErrorMessage,
);

const verheiratet = z.enum(
  ["nein", "ja", "getrennt", "geschieden", "verwitwet"],
  customRequiredErrorMessage,
);

const arbeitArt = z.object({
  angestellt: checkedOptional,
  selbstaendig: checkedOptional,
});

const zahlungArbeitgeber = z.object({
  urlaubsgeld: checkedOptional,
  weihnachtsgeld: checkedOptional,
  ueberstundenBezahlt: checkedOptional,
  abfindung: checkedOptional,
  anderes: checkedOptional,
});

const hasSozialleistungen = z.enum(
  [
    "buergergeld",
    "grundsicherungSozialhilfe",
    "asylbewerberleistungen",
    "nein",
  ],
  customRequiredErrorMessage,
);

const sozialleistungenUmstaende = z.object({
  pflegegeld: checkedOptional,
  kindergeld: checkedOptional,
  wohngeld: checkedOptional,
  nein: checkedOptional,
});

const pflegegeld = z.enum(["selbst", "fremd"], customRequiredErrorMessage);

export const context = {
  hasKontopfaendung,
  hasPKonto,
  schuldenBei,
  sockelbetrag,
  hasKinder: YesNoAnswer,
  kinderWohnenZusammen,
  verheiratet,
  kinderUnterhalt: YesNoAnswer,
  partnerWohnenZusammen: YesNoAnswer,
  partnerUnterhalt: YesNoAnswer,
  hasArbeit: YesNoAnswer,
  arbeitArt,
  nachzahlungArbeitgeber: YesNoAnswer,
  arbeitgeberNachzahlungHigherThan: YesNoAnswer,
  zahlungArbeitgeber,
  hasSozialleistungen,
  sozialleistungenUmstaende,
  hasSozialleistungNachzahlung: YesNoAnswer,
  sozialleistungNachzahlungHigherThan: YesNoAnswer,
  hasSozialleistungenEinmalzahlung: YesNoAnswer,
  pfaendungStrafe: YesNoAnswer,
  pfaendungUnterhalt: YesNoAnswer,
  pflegegeld,
} as const;

const _contextObject = z.object(context).partial();
export type KontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
