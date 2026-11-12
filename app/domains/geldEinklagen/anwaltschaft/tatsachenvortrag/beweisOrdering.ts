import type { Absatz, Beweis, BeweisType } from "./tatsachenvortragSchemas";
import type { GeldEinklagenAnwaltschaftUserData } from "../userData";

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
  hauptantragArrayIndex: number;
  nebenantragArrayIndex: number | undefined;
  absatzArrayIndex: number;
  beweise: OrderedBeweis[];
};

/**
 * Shared UI/PDF order: each Hauptantrag's paragraphs, then its Nebenantraege,
 * followed by the next Hauptantrag. Document numbers are one-based and derived
 * across the entire Klageschrift; source indexes remain unchanged.
 */
export const getOrderedAbsaetze = (
  userData: Pick<GeldEinklagenAnwaltschaftUserData, "hauptantrag">,
): OrderedAbsatz[] => {
  const result: OrderedAbsatz[] = [];
  let documentNumber = 0;

  for (const [hauptantragArrayIndex, hauptantrag] of (
    userData.hauptantrag ?? []
  ).entries()) {
    const groups = [
      {
        nebenantragArrayIndex: undefined,
        absaetze: hauptantrag.absaetze,
      },
      ...(hauptantrag.nebenantraege ?? []).map(
        (nebenantrag, nebenantragArrayIndex) => ({
          nebenantragArrayIndex,
          absaetze: nebenantrag.absaetze,
        }),
      ),
    ];

    for (const { nebenantragArrayIndex, absaetze } of groups) {
      for (const [absatzArrayIndex, absatz] of (absaetze ?? []).entries()) {
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
          hauptantragArrayIndex,
          nebenantragArrayIndex,
          absatzArrayIndex,
          beweise: [...documents, ...people],
        });
      }
    }
  }

  return result;
};
