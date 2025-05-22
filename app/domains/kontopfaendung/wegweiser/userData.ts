import { z } from "zod";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const kontopfaendungInputSchema = z.enum(
  ["nein", "ja", "weissNicht"],
  customRequiredErrorMessage,
);

const pKontoInputSchema = z.enum(
  ["nein", "ja", "nichtAktiv", "nichtEingerichtet"],
  customRequiredErrorMessage,
);

const schuldenBeiInputSchema = z.enum(
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

const sockelbetragInputSchema = z.enum(
  ["nein", "ja", "weissNicht", "unterschiedlich"],
  customRequiredErrorMessage,
);

const kinderWohnenZusammenInputSchema = z.enum(
  ["nein", "ja", "teilweise"],
  customRequiredErrorMessage,
);

const verheiratetInputSchema = z.enum(
  ["nein", "ja", "getrennt", "geschieden", "verwitwet"],
  customRequiredErrorMessage,
);

const arbeitArtInputSchema = z.object({
  angestellt: checkedOptional,
  selbstaendig: checkedOptional,
});

const zahlungArbeitgeberInputSchema = z.object({
  urlaubsgeld: checkedOptional,
  weihnachtsgeld: checkedOptional,
  ueberstundenBezahlt: checkedOptional,
  abfindung: checkedOptional,
  anderes: checkedOptional,
});

const sozialleistungenInputSchema = z.enum(
  [
    "buergergeld",
    "grundsicherungSozialhilfe",
    "asylbewerberleistungen",
    "nein",
  ],
  customRequiredErrorMessage,
);

const sozialleistungenUmstaendeInputSchema = z.object({
  pflegegeld: checkedOptional,
  kindergeld: checkedOptional,
  wohngeld: checkedOptional,
});

const pflegegeldInputSchema = z.enum(
  ["selbst", "fremd"],
  customRequiredErrorMessage,
);

export const kontopfaendungWegweiserInputSchema = {
  hasKontopfaendung: kontopfaendungInputSchema,
  hasPKonto: pKontoInputSchema,
  schuldenBei: schuldenBeiInputSchema,
  sockelbetrag: sockelbetragInputSchema,
  hasKinder: YesNoAnswer,
  kinderWohnenZusammen: kinderWohnenZusammenInputSchema,
  verheiratet: verheiratetInputSchema,
  kinderUnterhalt: YesNoAnswer,
  partnerWohnenZusammen: YesNoAnswer,
  partnerUnterhalt: YesNoAnswer,
  hasArbeit: YesNoAnswer,
  arbeitArt: arbeitArtInputSchema,
  nachzahlungArbeitgeber: YesNoAnswer,
  arbeitgeberNachzahlungHigherThan: YesNoAnswer,
  zahlungArbeitgeber: zahlungArbeitgeberInputSchema,
  hasSozialleistungen: sozialleistungenInputSchema,
  sozialleistungenUmstaende: sozialleistungenUmstaendeInputSchema,
  hasSozialleistungNachzahlung: YesNoAnswer,
  sozialleistungNachzahlungHigherThan: YesNoAnswer,
  hasSozialleistungenEinmalzahlung: YesNoAnswer,
  pfaendungStrafe: YesNoAnswer,
  pfaendungUnterhalt: YesNoAnswer,
  pflegegeld: pflegegeldInputSchema,
} as const;

const _partialSchema = z.object(kontopfaendungWegweiserInputSchema).partial();
export type KontopfaendungWegweiserUserData = z.infer<typeof _partialSchema>;
