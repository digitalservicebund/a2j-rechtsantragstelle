import type { Absatz, Beweis, BeweisType } from "./tatsachenvortragSchemas";
import type { GeldEinklagenAnwaltschaftUserData } from "../userData";
import {
  type AntraegeUserData,
  getOrderedAntraege,
  getVortragIndex,
  type OrderedAntrag,
} from "./antragOrdering";

export type BeweisCategory = "document" | "person";

export const getBeweisCategory = (type: BeweisType): BeweisCategory => {
  switch (type) {
    case "urkunde":
    case "augenschein":
    case "sachverstaendigengutachten":
      return "document";
    case "zeuge":
    case "parteivernehmung":
      return "person";
  }
};

export type OrderedBeweis = {
  beweis: Beweis;
  sourceIndex: number;
  documentNumber: number | undefined;
};

export type OrderedAbsatz = {
  absatz: Absatz;
  antrag: OrderedAntrag;
  vortragArrayIndex: number;
  absatzArrayIndex: number;
  beweise: OrderedBeweis[];
};

/**
 * Shared UI/PDF order of paragraphs, following getOrderedAntraege. Document
 * numbers (K1, K2, …) are one-based and run across the entire Klageschrift;
 * source indexes remain unchanged. Vorträge of deleted Anträge are skipped.
 */
export const getOrderedAbsaetze = (
  userData: AntraegeUserData &
    Pick<GeldEinklagenAnwaltschaftUserData, "vortraege">,
): OrderedAbsatz[] => {
  const result: OrderedAbsatz[] = [];
  let documentNumber = 0;

  for (const antrag of getOrderedAntraege(userData)) {
    const vortragArrayIndex = getVortragIndex(userData, antrag.antragId);
    const absaetze = userData.vortraege?.[vortragArrayIndex]?.absaetze ?? [];

    for (const [absatzArrayIndex, absatz] of absaetze.entries()) {
      const documents: OrderedBeweis[] = [];
      const people: OrderedBeweis[] = [];

      for (const [sourceIndex, beweis] of (absatz.beweise ?? []).entries()) {
        if (getBeweisCategory(beweis.type) === "document") {
          documentNumber += 1;
          documents.push({ beweis, sourceIndex, documentNumber });
        } else {
          people.push({ beweis, sourceIndex, documentNumber: undefined });
        }
      }

      result.push({
        absatz,
        antrag,
        vortragArrayIndex,
        absatzArrayIndex,
        beweise: [...documents, ...people],
      });
    }
  }

  return result;
};
