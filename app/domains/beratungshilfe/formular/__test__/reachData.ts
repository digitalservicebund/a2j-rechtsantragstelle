import { type BeratungshilfeFormularUserData } from "../userData";

// Cumulative upstream answers that steer the new engine's first-match simulation
// from /start/start down to the entry of each section. A section testcase that
// starts mid-flow must spread the matching prefix into its FIRST step, otherwise
// the page is unreachable from the start and its data is pruned (making
// nextPath/prevPath undefined). Each prefix builds on the previous one.

// Reaches the anwaltliche-vertretung start (all grundvoraussetzung answers "no").
export const reachAnwaltlicheVertretung = {
  rechtsschutzversicherung: "no",
  wurdeVerklagt: "no",
  klageEingereicht: "no",
  hamburgOderBremen: "no",
  beratungshilfeBeantragt: "no",
  eigeninitiativeGrundvorraussetzung: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Reaches rechtsproblem + einkommen start (anwaltskanzlei "no", then unconditional).
export const reachRechtsproblem = {
  ...reachAnwaltlicheVertretung,
  anwaltskanzlei: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

// einkommen start is reached by the same answers (rechtsproblem -> einkommen is unconditional).
export const reachEinkommen = reachRechtsproblem;

// Reaches the partner section (no state benefits, not employed).
export const reachPartner = {
  ...reachRechtsproblem,
  staatlicheLeistungen: "keine",
  erwerbstaetig: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Reaches the kinder section.
export const reachKinder = {
  ...reachPartner,
  partnerschaft: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Reaches the andere-unterhaltszahlungen section.
export const reachUnterhaltszahlungen = {
  ...reachKinder,
  hasKinder: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Reaches the wohnung section.
export const reachWohnung = {
  ...reachUnterhaltszahlungen,
  hasWeitereUnterhaltszahlungen: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Reaches the eigentum section (lives alone -> eigentum-info).
export const reachEigentum = {
  ...reachWohnung,
  livingSituation: "alone",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Reaches the regelmaessige-ausgaben section (no eigentum of any kind).
export const reachAusgaben = {
  ...reachEigentum,
  hasBankkonto: "no",
  hasGeldanlage: "no",
  hasKraftfahrzeug: "no",
  hasWertsache: "no",
  hasGrundeigentum: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Within eigentum, each sub-section (bankkonten -> geldanlagen -> kraftfahrzeuge
// -> wertgegenstaende -> grundeigentum) is only reachable once the earlier ones
// are answered "no". reachEigentum already reaches the bankkonten question.
export const reachEigentumGeldanlagen = {
  ...reachEigentum,
  hasBankkonto: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

export const reachEigentumKraftfahrzeuge = {
  ...reachEigentumGeldanlagen,
  hasGeldanlage: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

export const reachEigentumWertgegenstaende = {
  ...reachEigentumKraftfahrzeuge,
  hasKraftfahrzeug: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

export const reachEigentumGrundeigentum = {
  ...reachEigentumWertgegenstaende,
  hasWertsache: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Reaches eigentum-info via the partnerschaft "yes" path, so eigentum-info routes
// to the heirat-info branch (partner present, no state benefits).
export const reachEigentumViaPartner = {
  ...reachRechtsproblem,
  staatlicheLeistungen: "keine",
  erwerbstaetig: "no",
  partnerschaft: "yes",
  zusammenleben: "yes",
  partnerEinkommen: "no",
  hasKinder: "no",
  hasWeitereUnterhaltszahlungen: "no",
  livingSituation: "alone",
} satisfies Partial<BeratungshilfeFormularUserData>;

// Reaches persoenliche-daten (and, via unconditional steps, weitere-angaben + abgabe).
export const reachPersoenlicheDaten = {
  ...reachAusgaben,
  hasAusgaben: "no",
} satisfies Partial<BeratungshilfeFormularUserData>;
