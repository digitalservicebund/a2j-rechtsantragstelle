import { z } from "zod";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const errorMap = () => ({ message: `Bitte treffen Sie eine Auswahl.` });

export const hasKontopfaendung = z.enum(["nein", "ja", "weissNicht"], {
  errorMap,
});

export const hasPKonto = z.enum(["nein", "ja", "nichtAktiv", "bank"], {
  errorMap,
});

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
  { errorMap },
);

export const euroSchwelle = z.enum(
  ["nein", "ja", "weissNicht", "unterschiedlich"],
  { errorMap },
);

export const verheiratet = z.enum(
  ["nein", "ja", "getrennt", "geschieden", "verwitwet"],
  { errorMap },
);

export const kinderLebtMit = z.enum(["nein", "ja", "weissNicht"], {
  errorMap,
});

export const arbeitsweise = z.object(
  { angestellt: checkedOptional, selbstaendig: checkedOptional },
  {
    errorMap,
  },
);

export const zahlungArbeitgeber = z.object(
  {
    urlaubsgeld: checkedOptional,
    weihnachtsgeld: checkedOptional,
    ueberstundenBezahlt: checkedOptional,
    abfindung: checkedOptional,
    anderes: checkedOptional,
    nein: checkedOptional,
  },
  {
    errorMap,
  },
);

export const hasSozialleistungen = z.enum(
  [
    "buergergeld",
    "grundsicherungSozialhilfe",
    "asylbewerberleistungen",
    "nein",
  ],
  {
    errorMap,
  },
);

export const sozialleistungenUmstaende = z.object(
  {
    pflegegeld: z.enum(["off", "on"]),
    kindergeld: z.enum(["off", "on"]),
    wohngeld: z.enum(["off", "on"]),
    nein: z.enum(["off", "on"]),
  },
  {
    errorMap,
  },
);

export const besondereAusgaben = z.object(
  {
    erkrankungBehinderung: checkedOptional,
    KostenWegenHoherMiete: checkedOptional,
    weitere: checkedOptional,
    nein: checkedOptional,
  },
  {
    errorMap,
  },
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
} as const;

const _contextObject = z.object(context).partial();
export type KontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
