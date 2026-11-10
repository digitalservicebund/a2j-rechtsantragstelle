import { randomUUID } from "node:crypto";
import { type PosFlowAction } from "~/domains/flows.server";
import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";
import { updateSession } from "~/services/session.server";
import { type GeldEinklagenAnwaltschaftUserData } from "../userData";
import {
  type BeweiseArray,
  type BeweisType,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { getBeweisArrayName } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import get from "lodash/get";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import set from "lodash/set";

export const setBeweisIdentity =
  (type: BeweisType, isHauptantrag: boolean): PosFlowAction =>
  (request, userData: GeldEinklagenAnwaltschaftUserData, flowSession) => {
    const arrayIndexes = parseArrayIndexesFromPathname(request.url);
    const arrayName = getBeweisArrayName(isHauptantrag);
    const arrayObjectString = resolveArrayCharacter(
      arrayName.replaceAll("#", "#."),
      arrayIndexes,
    );
    const items = get(userData, arrayObjectString) as BeweiseArray | undefined;
    if (
      arrayIndexes.length === 0 ||
      items?.at(arrayIndexes.at(-1) ?? -1) === undefined
    ) {
      throw new Error("Missing Beweis item for submitted page");
    }

    updateSession(
      flowSession,
      set(
        userData,
        arrayObjectString,
        items.map((item, index) => ({
          ...item,
          id: item.id ?? randomUUID(),
          ...(index === arrayIndexes.at(-1) ? { type } : {}),
        })),
      ),
    );
    return Promise.resolve();
  };
