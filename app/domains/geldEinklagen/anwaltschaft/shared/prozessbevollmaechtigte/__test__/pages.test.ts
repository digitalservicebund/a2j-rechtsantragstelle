import { z } from "zod";
import { createFlowSession } from "~/services/flow/flowEngine/createFlowSession";
import { geldEinklagenAnwaltschaftFlowConfig } from "../../../flowConfig";
import { getProzessbevollmaechtigteArrayName } from "../prozessbevollmaechtigteHelpers";
import { einzelkanzlei, gesellschaft } from "./fixtures";

describe.each(["klagende", "beklagte"] as const)(
  "%s Prozessbevollmaechtigte pages",
  (relationship) => {
    const arrayName = getProzessbevollmaechtigteArrayName(relationship);
    const basePath = `/${relationship}-partei/prozessbevollmaechtigte`;
    const otherArrayName = getProzessbevollmaechtigteArrayName(
      relationship === "klagende" ? "beklagte" : "klagende",
    );

    it("keeps the existing main flow reachable through both overviews", () => {
      const session = createFlowSession(
        geldEinklagenAnwaltschaftFlowConfig,
        {},
        `${basePath}/uebersicht`,
      );
      expect(session.nextPath).toBe(
        relationship === "klagende"
          ? "/beklagte-partei/beklagten/uebersicht"
          : "/prozessantraege-prozessuale-ausfuehrungen",
      );
      expect(session.prevPath).toBe(
        relationship === "klagende"
          ? "/klagende-partei/klagenden/uebersicht"
          : "/beklagte-partei/beklagten/uebersicht",
      );
      expect(session.isReachable("/klage-herunterladen")).toBe(true);
      expect(
        Object.keys(
          session.statusTree[`/${relationship}-partei`]?.children ?? {},
        ),
      ).toEqual([
        relationship === "klagende" ? "/klagenden" : "/beklagten",
        "/prozessbevollmaechtigte",
      ]);
    });

    it.each([undefined, []])(
      "treats an absent or empty entry as optional only for Beklagte: %j",
      (items) => {
        const session = createFlowSession(
          geldEinklagenAnwaltschaftFlowConfig,
          { [arrayName]: items },
          `${basePath}/uebersicht`,
        );
        expect(
          session.statusTree[`/${relationship}-partei`]?.children?.[
            "/prozessbevollmaechtigte"
          ]?.isDone,
        ).toBe(relationship === "beklagte");
      },
    );

    it.each(["einzelkanzlei", "berufsausuebungsgesellschaft"] as const)(
      "allows adding and editing %s with the matching page schema",
      (type) => {
        const path = `${basePath}/#/${type}-daten`;
        const item = type === "einzelkanzlei" ? einzelkanzlei : gesellschaft;
        const input = Object.fromEntries(
          Object.entries(item).map(([field, value]) => [
            `${arrayName}#${field}`,
            value,
          ]),
        );
        const schema = geldEinklagenAnwaltschaftFlowConfig.getSchema(path);
        expect(schema).toBeDefined();
        expect(z.validate(schema!, input)).toBe(true);
        expect(
          z.validate(schema!, { ...input, [`${arrayName}#name`]: "" }),
        ).toBe(false);
        expect(
          z.validate(schema!, { ...input, [`${arrayName}#email`]: "invalid" }),
        ).toBe(false);
        if (type === "berufsausuebungsgesellschaft") {
          expect(
            z.validate(schema!, {
              ...input,
              [`${arrayName}#isProzessbevollmaechtigt`]: undefined,
            }),
          ).toBe(false);
        }
        const session = createFlowSession(
          geldEinklagenAnwaltschaftFlowConfig,
          { [arrayName]: [item], pageData: { arrayIndexes: [0] } },
          path,
        );
        expect(session.isReachable(path)).toBe(true);
        expect(session.prevPath).toBe(`${basePath}/uebersicht`);
        expect(session.nextPath).toBe(`${basePath}/uebersicht`);
        const addSession = createFlowSession(
          geldEinklagenAnwaltschaftFlowConfig,
          { pageData: { arrayIndexes: [0] } },
          path,
        );
        expect(addSession.isReachable(path)).toBe(true);
        expect(
          addSession.statusTree[`/${relationship}-partei`]?.children?.[
            "/prozessbevollmaechtigte"
          ]?.isDone,
        ).toBe(false);
      },
    );

    it.each([einzelkanzlei, gesellschaft])(
      "marks one entry complete without validating the other type's fields",
      (item) => {
        const data = {
          [arrayName]: [item],
          [otherArrayName]: [einzelkanzlei],
        };
        const session = createFlowSession(
          geldEinklagenAnwaltschaftFlowConfig,
          data,
          `${basePath}/uebersicht`,
        );
        expect(session.prunedUserData).toEqual(data);
        expect(
          session.statusTree[`/${relationship}-partei`]?.children?.[
            "/prozessbevollmaechtigte"
          ]?.isDone,
        ).toBe(true);
      },
    );

    it("keeps an unfinished entry incomplete", () => {
      const session = createFlowSession(
        geldEinklagenAnwaltschaftFlowConfig,
        { [arrayName]: [{ ...einzelkanzlei, vorname: "" }] },
        `${basePath}/uebersicht`,
      );
      expect(
        session.statusTree[`/${relationship}-partei`]?.children?.[
          "/prozessbevollmaechtigte"
        ]?.isDone,
      ).toBe(false);
    });
  },
);
