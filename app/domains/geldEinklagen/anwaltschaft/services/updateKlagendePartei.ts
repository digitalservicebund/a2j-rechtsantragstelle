import merge from "lodash/merge";
import { type AsyncFlowAction } from "~/domains/flows.server";
import {
  getPluralOfKlageParteiRelationship,
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";
import { updateSession } from "~/services/session.server";

export const updatePartei =
  (
    relationship: KlageParteiVerhaeltnis,
    type: KlageParteiType,
  ): AsyncFlowAction =>
  async (request, userData: GeldEinklagenAnwaltschaftUserData, flowSession) => {
    const arrayIndex = parseArrayIndexesFromPathname(request.url).at(0);
    const updatedParteien = userData[
      getPluralOfKlageParteiRelationship(relationship)
    ]?.map((partei) => ({
      ...partei,
      type,
      index: (arrayIndex ?? 0) + 1,
    }));

    const updatedUserData = merge({}, userData, {
      [getPluralOfKlageParteiRelationship(relationship)]: updatedParteien,
    });
    updateSession(flowSession, updatedUserData);
  };
