import { randomUUID } from "node:crypto";
import { type PosFlowAction } from "~/domains/flows.server";
import { type Nebenantrag } from "../hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";
import { updateSession } from "~/services/session.server";
import { type GeldEinklagenAnwaltschaftUserData } from "../userData";

export const setNebenantragIdentity =
  (type: Nebenantrag["type"]): PosFlowAction =>
  (request, userData: GeldEinklagenAnwaltschaftUserData, flowSession) => {
    const [hauptantragIndex, nebenantragIndex] = parseArrayIndexesFromPathname(
      request.url,
    );
    if (
      hauptantragIndex === undefined ||
      nebenantragIndex === undefined ||
      !userData.hauptantrag?.[hauptantragIndex]?.nebenantraege?.[
        nebenantragIndex
      ]
    ) {
      throw new Error("Missing Nebenantrag item for submitted page");
    }

    updateSession(flowSession, {
      ...userData,
      hauptantrag: userData.hauptantrag.map((hauptantrag, index) =>
        index === hauptantragIndex
          ? {
              ...hauptantrag,
              nebenantraege: hauptantrag.nebenantraege?.map((item, index) =>
                index === nebenantragIndex
                  ? { ...item, id: item.id || randomUUID(), type }
                  : item,
              ),
            }
          : hauptantrag,
      ),
    });
    return Promise.resolve();
  };
