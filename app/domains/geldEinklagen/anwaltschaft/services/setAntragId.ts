import { randomUUID } from "node:crypto";
import get from "lodash/get";
import set from "lodash/set";
import { type PosFlowAction } from "~/domains/flows.server";
import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";
import { updateSession } from "~/services/session.server";
import { type GeldEinklagenAnwaltschaftUserData } from "../userData";

type AntragArrayPath =
  | "hauptantrag"
  | "schmerzengeldantrag"
  | "schmerzengeldantrag#nebenantraege"
  | "sonstigeAntraege";

/**
 * Gives the submitted Antrag a stable ID, which links it to its Vortrag
 * (see getOrderedAntraege). Existing IDs are kept.
 */
export const setAntragId =
  (arrayPath: AntragArrayPath): PosFlowAction =>
  (request, userData: GeldEinklagenAnwaltschaftUserData, flowSession) => {
    const arrayNames = arrayPath.split("#");
    const arrayIndexes = parseArrayIndexesFromPathname(request.url);
    const itemPath = arrayNames.flatMap((name, depth) => [
      name,
      arrayIndexes[depth],
    ]);
    const item = get(userData, itemPath) as { id?: string } | undefined;
    if (arrayIndexes.length !== arrayNames.length || !item) {
      throw new Error("Missing Antrag item for submitted page");
    }
    if (item.id) return Promise.resolve();

    const [topLevelArray] = arrayNames as [
      keyof GeldEinklagenAnwaltschaftUserData,
    ];
    const update = {
      [topLevelArray]: structuredClone(userData[topLevelArray]),
    };
    set(update, [...itemPath, "id"], randomUUID());
    updateSession(flowSession, update);
    return Promise.resolve();
  };
