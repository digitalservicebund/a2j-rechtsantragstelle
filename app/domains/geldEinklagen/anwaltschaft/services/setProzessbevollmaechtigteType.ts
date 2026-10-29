import { randomUUID } from "node:crypto";
import { type PosFlowAction } from "~/domains/flows.server";
import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";
import { updateSession } from "~/services/session.server";
import { type KlageParteiVerhaeltnis } from "../shared/klageParties/klagePartySchemas";
import { getProzessbevollmaechtigteArrayName } from "../shared/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";
import { type ProzessbevollmaechtigteType } from "../shared/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "../userData";

export const setProzessbevollmaechtigteType =
  (
    relationship: KlageParteiVerhaeltnis,
    type: ProzessbevollmaechtigteType,
  ): PosFlowAction =>
  (request, userData: GeldEinklagenAnwaltschaftUserData, flowSession) => {
    const arrayIndex = parseArrayIndexesFromPathname(request.url).at(0);
    const arrayName = getProzessbevollmaechtigteArrayName(relationship);
    const items = userData[arrayName];
    if (arrayIndex === undefined || !items?.[arrayIndex]) {
      throw new Error(
        "Missing Prozessbevollmaechtigte item for submitted page",
      );
    }

    updateSession(flowSession, {
      ...userData,
      [arrayName]: items.map((item, index) => ({
        ...item,
        id: item.id ?? randomUUID(),
        ...(index === arrayIndex ? { type } : {}),
      })),
    });
    return Promise.resolve();
  };
