import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";
import type { ProzesskostenhilfeFormularUserData } from "./userData";

export const belegeStrings = (context: ProzesskostenhilfeFormularUserData) => {
  return {
    rsvDeckung:
      context.hasRsvCoverage === "partly" || context.hasRsvCoverage === "no",
    rsvOrgDeckung:
      context.hasOrgCoverage === "partly" || context.hasOrgCoverage === "no",
    hasBuergergeld: context.staatlicheLeistungen === "buergergeld",
    hasArbeitslosengeld: context.staatlicheLeistungen === "arbeitslosengeld",
    hasGrundsicherung: context.staatlicheLeistungen === "grundsicherung",
    hasAsylbewerberleistungen:
      context.staatlicheLeistungen === "asylbewerberleistungen",
    isAngestellt:
      context.employmentType === "employed" ||
      context.employmentType === "employedAndSelfEmployed",
    isSelbstaendig:
      context.employmentType === "selfEmployed" ||
      context.employmentType === "employedAndSelfEmployed",
    hasAbzuege: parseCurrencyStringDE(context.selbststaendigAbzuege) > 0,
    hasWerbungskosten: context.hasArbeitsausgaben === "yes",
    hasRente: context.receivesPension === "yes",
    hasWohngeld: context.leistungen?.wohngeld === "on",
    hasKrankengeld: context.leistungen?.krankengeld === "on",
    hasElterngeld: context.leistungen?.elterngeld === "on",
    hasWeitereEinkuenfte:
      context.weitereEinkuenfte && context.weitereEinkuenfte.length > 0,
    partnerHasBuergergeld:
      context["partner-staatlicheLeistungen"] === "buergergeld",
    partnerHasArbeitslosengeld:
      context["partner-staatlicheLeistungen"] === "arbeitslosengeld",
    partnerHasAsylbewerberleistungen:
      context["partner-staatlicheLeistungen"] === "asylbewerberleistungen",
    partnerHasGrundsicherung:
      context["partner-staatlicheLeistungen"] === "grundsicherung",
    partnerIsAngestellt:
      context["partner-employmentType"] === "employed" ||
      context["partner-employmentType"] === "employedAndSelfEmployed",
    partnerIsSelbststaendig:
      context["partner-employmentType"] === "selfEmployed" ||
      context["partner-employmentType"] === "employedAndSelfEmployed",
    partnerHasAbzuege:
      parseCurrencyStringDE(context["partner-selbststaendigAbzuege"]) > 0,
    partnerHasWerbungskosten: context["partner-hasArbeitsausgaben"] === "yes",
    partnerHasRente: context["partner-receivesPension"] === "yes",
    partnerHasWohngeld: context.partnerLeistungen?.wohngeld === "on",
    partnerHasKrankengeld: context.partnerLeistungen?.krankengeld === "on",
    partnerHasElterngeld: context.partnerLeistungen?.elterngeld === "on",
    partnerWeitereEinkuenfte:
      context["partner-weitereEinkuenfte"] &&
      context["partner-weitereEinkuenfte"].length > 0,
    isHomeowner: context.rentsApartment === "no",
    hasParkplatzImMietvertrag:
      context.garageParkplatz === "yesPartOfTheContract",
    hasGrundeigentum: context.hasGrundeigentum === "yes",
    hasKraftfahrzeug: context.hasKraftfahrzeug === "yes",
    hasWertpapier: context.geldanlagen?.some(
      (geldanlage) => geldanlage.art === "wertpapiere",
    ),
    hasGeldanlageBefristet: context.geldanlagen?.some(
      (geldanlage) => geldanlage.art === "befristet",
    ),
    hasGeldanlageSonstige: context.geldanlagen?.some(
      (geldanlage) => geldanlage.art === "sonstiges",
    ),
    hasGuthabenKryptoKonto: context.geldanlagen?.some(
      (geldanlage) => geldanlage.art === "guthabenkontoKrypto",
    ),
    hasGiroTagesSparKonto: context.geldanlagen?.some(
      (geldanlage) => geldanlage.art === "giroTagesgeldSparkonto",
    ),
    hasSchwangerschaft: context.besondereBelastungen?.pregnancy === "on",
    hasSchwerbehinderung: context.besondereBelastungen?.disability === "on",
    hasKostenaufwaendigeErnaehrung:
      context.besondereBelastungen?.medicalReasons === "on",
    hasVersicherung:
      context.versicherungen && context.versicherungen?.length > 0,
    hasRatenzahlung:
      context.ratenzahlungen && context.ratenzahlungen?.length > 0,
    hasSonstigeAusgaben:
      context.sonstigeAusgaben && context.sonstigeAusgaben?.length > 0,
    hasWeitereDokumente: context.weitereDokumenteBeweis !== undefined,
  };
};
