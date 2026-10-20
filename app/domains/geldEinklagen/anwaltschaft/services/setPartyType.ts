import merge from "lodash/merge";
import { randomUUID } from "node:crypto";
import { type AsyncFlowAction } from "~/domains/flows.server";
import {
  getPluralOfKlageParteiRelationship,
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";
import { updateSession } from "~/services/session.server";

export const setPartyType =
  (
    relationship: KlageParteiVerhaeltnis,
    type: KlageParteiType,
  ): AsyncFlowAction =>
  (request, userData: GeldEinklagenAnwaltschaftUserData, flowSession) => {
    const arrayIndex = parseArrayIndexesFromPathname(request.url).at(0);
    const arrayName = getPluralOfKlageParteiRelationship(relationship);
    const targetArray = userData[arrayName];
    if (arrayIndex === undefined) return Promise.resolve();

    const currentParty = targetArray?.at(arrayIndex);

    if (!targetArray || !currentParty) return Promise.resolve();

    const updatedParteien = targetArray.map((partei, idx) => ({
      ...partei,
      id: partei.id ?? randomUUID(),
      ...(idx === arrayIndex ? { type } : {}),
    }));

    const updatedUserData = merge({}, userData, {
      [arrayName]: updatedParteien,
    });
    updateSession(flowSession, updatedUserData);
    return Promise.resolve();
  };
