import { z } from "zod";

export const schuldenBeiType = z.enum([
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
]);

export const pKontoType = z.enum(["nein", "ja", "nichtAktiv", "bank"]);

export const kontopfaendungType = z.enum(["nein", "ja", "weissNicht"]);

export const euroSchwelleType = z.enum([
  "nein",
  "ja",
  "weissNicht",
  "unterschiedlich",
]);

export const context = {
  hasKontopfaendung: kontopfaendungType,
  hasPKonto: pKontoType,
  schuldenBei: schuldenBeiType,
  euroSchwelle: euroSchwelleType,
} as const;

const _contextObject = z.object(context).partial();
export type kontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
