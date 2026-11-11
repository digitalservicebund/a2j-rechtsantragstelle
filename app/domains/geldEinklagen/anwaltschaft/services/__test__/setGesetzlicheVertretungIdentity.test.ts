import { createSession, type Session } from "react-router";
import { z } from "zod";
import { createFlowSession } from "~/services/flow/flowEngine/createFlowSession";
import { geldEinklagenAnwaltschaft } from "../../index";
import { geldEinklagenAnwaltschaftFlowConfig } from "../../flowConfig";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";

describe("setGesetzlicheVertretungIdentity", () => {
  it.each([
    [
      "klagende",
      "klagenden",
      "daten",
      "/klagende-partei/klagenden/#/gesetzliche-vertretung/#/daten",
    ],
    [
      "klagende",
      "klagenden",
      "daten-organisation",
      "/klagende-partei/klagenden/#/gesetzliche-vertretung/#/daten-organisation",
    ],
    [
      "beklagte",
      "beklagten",
      "daten",
      "/beklagte-partei/beklagten/#/gesetzliche-vertretung/#/daten",
    ],
    [
      "beklagte",
      "beklagten",
      "daten-organisation",
      "/beklagte-partei/beklagten/#/gesetzliche-vertretung/#/daten-organisation",
    ],
  ] as const)(
    "assigns and preserves an ID for %s on %s/%s",
    async (relationship, userDataKey, pageName, stepId) => {
      const existingId = crypto.randomUUID();
      const person = {
        anrede: "frau",
        titel: "",
        vorname: "Erika",
        nachname: "Test",
        strasse: "Strasse",
        hausnummer: "1",
        plz: "12345",
        ort: "Ort",
        land: "Deutschland",
      };
      const party =
        pageName === "daten"
          ? { ...person, type: "natuerliche-person", id: crypto.randomUUID() }
          : {
              ...person,
              type: "organisation",
              id: crypto.randomUUID(),
              orgName: "Beispiel",
              orgVertretungArt: "vorstand-vorstaendin",
              orgVertretungAnrede: "frau",
              orgVertretungTitel: "",
              orgVertretungVorname: "Beate",
              orgVertretungNachname: "Test",
            };
      const vertretungArt =
        pageName === "daten" ? "elternteil" : "vorstand-vorstaendin";
      const userData = {
        [userDataKey]: [
          {
            ...party,
            id: crypto.randomUUID(),
            "gesetzliche-vertretung": [
              { ...person, art: vertretungArt, vorname: "Other party" },
            ],
          },
          {
            ...party,
            "gesetzliche-vertretung": [
              {
                ...person,
                art: vertretungArt,
                id: existingId,
                vorname: "Existing",
              },
              { ...person, art: vertretungArt, vorname: "New" },
            ],
          },
        ],
      };
      const session: Session = createSession(userData);
      const action = geldEinklagenAnwaltschaft.posFlowActions[stepId];
      const request = new Request(
        `http://localhost/${relationship}-partei/${userDataKey}/1/gesetzliche-vertretung/1/${pageName}`,
      );
      const submitted = createFlowSession(
        geldEinklagenAnwaltschaftFlowConfig,
        { ...session.data, pageData: { arrayIndexes: [1, 1] } },
        stepId,
      ).prunedUserData;
      await action(request, submitted, session);
      const saved = session.get(userDataKey);
      const newId = saved[1]["gesetzliche-vertretung"][1].id;
      expect(z.uuid().safeParse(newId).success).toBe(true);
      expect(newId).not.toBe(existingId);
      expect(saved[0]).toEqual(userData[userDataKey][0]);
      expect(saved[1]["gesetzliche-vertretung"][0].id).toBe(existingId);
      await action(request, session.data, session);
      expect(session.get(userDataKey)).toEqual(saved);

      const pruned = createFlowSession(
        geldEinklagenAnwaltschaftFlowConfig,
        {
          ...session.data,
          pageData: { arrayIndexes: [1, 1] },
        },
        stepId,
      ).prunedUserData as GeldEinklagenAnwaltschaftUserData;
      expect(pruned[userDataKey]?.[1]["gesetzliche-vertretung"]?.[1].id).toBe(
        newId,
      );
    },
  );

  it("throws an error if the submitted representative is missing", async () => {
    const session = createSession({ klagenden: [{}] });
    const action =
      geldEinklagenAnwaltschaft.posFlowActions[
        "/klagende-partei/klagenden/#/gesetzliche-vertretung/#/daten"
      ];
    expect(() =>
      action(
        new Request(
          "http://localhost/klagende-partei/klagenden/0/gesetzliche-vertretung/0/daten",
        ),
        session.data,
        session,
      ),
    ).toThrow("Missing gesetzliche Vertretung for submitted page");
  });
});
