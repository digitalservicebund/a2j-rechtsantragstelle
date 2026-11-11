import { randomUUID } from "node:crypto";
import type { PosFlowAction } from "~/domains/flows.server";
import {
  getPluralOfKlageParteiRelationship,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";
import { updateSession } from "~/services/session.server";

export const setGesetzlicheVertretungIdentity =
  (relationship: KlageParteiVerhaeltnis): PosFlowAction =>
  (request, userData: GeldEinklagenAnwaltschaftUserData, flowSession) => {
    const [partyIndex, representativeIndex] = parseArrayIndexesFromPathname(
      request.url,
    );
    const arrayName = getPluralOfKlageParteiRelationship(relationship);
    const parties = userData[arrayName];
    const representatives =
      partyIndex === undefined
        ? undefined
        : parties?.[partyIndex]?.["gesetzliche-vertretung"];
    if (
      partyIndex === undefined ||
      representativeIndex === undefined ||
      !parties ||
      !representatives?.[representativeIndex]
    ) {
      throw new Error("Missing gesetzliche Vertretung for submitted page");
    }

    updateSession(flowSession, {
      [arrayName]: parties.map((party, index) =>
        index === partyIndex
          ? {
              ...party,
              "gesetzliche-vertretung": representatives.map(
                (representative, index) =>
                  index === representativeIndex
                    ? {
                        ...representative,
                        id: representative.id || randomUUID(),
                      }
                    : representative,
              ),
            }
          : party,
      ),
    });
    return Promise.resolve();
  };
