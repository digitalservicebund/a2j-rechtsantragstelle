import { createSession, type Session } from "react-router";
import { z } from "zod";
import { createFlowSession } from "~/services/flow/flowEngine/createFlowSession";
import { updateSession } from "~/services/session.server";
import { geldEinklagenAnwaltschaftFlowConfig } from "../../flowConfig";
import type { KlageParteien } from "../../shared/klageParties/klagePartySchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { setPartyType } from "../setPartyType";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(
    (session: Session, userData: Record<string, unknown>) => {
      for (const [key, value] of Object.entries(userData))
        session.set(key, value);
    },
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("setPartyType", () => {
  it.each([
    { type: "natuerliche-person", page: "natuerliche-person-daten" },
    { type: "organisation", page: "organisation-daten" },
  ] as const)(
    "sets $type and a stable ID on a submitted draft",
    ({ type, page }) => {
      const existingParty = { type: "natuerliche-person", vorname: "Erika" };
      const draftParty = { vorname: "Max", orgName: "Beispiel GmbH" };
      const klagenden = [existingParty, draftParty];
      const userData = { klagenden, pageData: { arrayIndexes: [1] } };
      const flowSession = createSession({ klagenden });
      const { prunedUserData } = createFlowSession(
        geldEinklagenAnwaltschaftFlowConfig,
        userData,
        `/klagende-partei/klagenden/#/${page}`,
      );

      expect(prunedUserData).toEqual({
        klagenden: [existingParty, draftParty],
      });

      setPartyType("klagende", type)(
        new Request(`http://localhost/klagende-partei/klagenden/1/${page}`),
        prunedUserData,
        flowSession,
      );

      expect(updateSession).toHaveBeenCalledWith(
        flowSession,
        expect.objectContaining({
          klagenden: [
            { ...existingParty, id: expect.any(String) },
            { ...draftParty, type, id: expect.any(String) },
          ],
        }),
      );
    },
  );

  it("should set the klagende type and one-based index from the request URL", () => {
    const userData = {
      otherData: "preserved",
      klagenden: [
        { name: "Erika Musterfrau", type: "juristische-person" },
        { name: "Max Mustermann", type: "juristische-person" },
      ],
    } as unknown as GeldEinklagenAnwaltschaftUserData;
    const mockSession: Session = createSession();

    setPartyType("klagende", "natuerliche-person")(
      new Request("http://localhost/antrag/1"),
      userData,
      mockSession,
    );

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({
        otherData: "preserved",
        klagenden: [
          {
            name: "Erika Musterfrau",
            type: "juristische-person",
            id: expect.any(String),
          },
          {
            name: "Max Mustermann",
            type: "natuerliche-person",
            id: expect.any(String),
          },
        ],
      }),
    );
  });

  it("should return early when the request URL has no array index", () => {
    const userData = {
      klagenden: [{ name: "Erika Musterfrau" }],
    } as unknown as GeldEinklagenAnwaltschaftUserData;
    const mockSession: Session = createSession();

    setPartyType("klagende", "natuerliche-person")(
      new Request("http://localhost/antrag"),
      userData,
      mockSession,
    );

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("preserves existing IDs and assigns unique UUIDs to legacy parties", () => {
    const partyId = crypto.randomUUID();
    const representativeId = crypto.randomUUID();
    const userData = {
      klagenden: [
        {
          id: partyId,
          type: "natuerliche-person",
          "gesetzliche-vertretung": [{ id: representativeId }, {}],
        },
        { type: "organisation" },
      ],
    } as unknown as GeldEinklagenAnwaltschaftUserData;
    const session = createSession(userData);
    const request = new Request("http://localhost/klagenden/0/daten");

    setPartyType("klagende", "natuerliche-person")(request, userData, session);
    const saved = session.get("klagenden") as KlageParteien;
    const ids = [saved[0].id, saved[1].id];

    expect(saved[0].id).toBe(partyId);
    expect(ids.every((id) => z.uuid().safeParse(id).success)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);

    setPartyType("klagende", "natuerliche-person")(
      request,
      session.data as GeldEinklagenAnwaltschaftUserData,
      session,
    );
    expect(session.get("klagenden")).toEqual(saved);
  });

  it("keeps IDs attached to their parties after removal changes the indexes", () => {
    const partyId = crypto.randomUUID();
    const userData = {
      klagenden: [
        { id: crypto.randomUUID(), type: "natuerliche-person" },
        { id: partyId, type: "organisation" },
      ],
    } as GeldEinklagenAnwaltschaftUserData;
    const session = createSession(userData);
    const remainingParties = userData.klagenden!.slice(1);
    session.set("klagenden", remainingParties);

    setPartyType("klagende", "organisation")(
      new Request("http://localhost/klagenden/0/daten"),
      session.data as GeldEinklagenAnwaltschaftUserData,
      session,
    );

    expect((session.get("klagenden") as KlageParteien)[0].id).toBe(partyId);
  });
});
