import { createSession, type Session } from "react-router";
import { createFlowSession } from "~/services/flow/flowEngine/createFlowSession";
import { geldEinklagenAnwaltschaftFlowConfig } from "../../flowConfig";
import { getProzessbevollmaechtigteArrayName } from "../../shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";
import { setProzessbevollmaechtigteType } from "../setProzessbevollmaechtigteType";
import { geldEinklagenAnwaltschaft } from "../../index";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(
    (session: Session, userData: Record<string, unknown>) => {
      for (const [key, value] of Object.entries(userData))
        session.set(key, value);
    },
  ),
}));

describe("setProzessbevollmaechtigteType", () => {
  it.each(["klagende", "beklagte"] as const)(
    "assigns %s with the route type and stable ID",
    async (relationship) => {
      for (const type of [
        "einzelkanzlei",
        "berufsausuebungsgesellschaft",
      ] as const) {
        const arrayName = getProzessbevollmaechtigteArrayName(relationship);
        const draft = { vorname: "Erika", name: "Musterkanzlei PartG" };
        const items = [draft];
        const data = { [arrayName]: items, pageData: { arrayIndexes: [0] } };
        const stepId =
          `/${relationship}-partei/prozessbevollmaechtigte/#/${type}-daten` as const;
        const { prunedUserData } = createFlowSession(
          geldEinklagenAnwaltschaftFlowConfig,
          data,
          stepId,
        );
        expect(prunedUserData).toEqual({ [arrayName]: items });
        const session: Session = createSession(prunedUserData);
        const action = geldEinklagenAnwaltschaft.posFlowActions[stepId];
        const request = new Request(
          `http://localhost/${relationship}-partei/prozessbevollmaechtigte/0/${type}-daten`,
        );
        await action(request, prunedUserData, session);
        const saved = session.get(arrayName);
        expect(saved).toEqual([{ ...draft, type, id: expect.any(String) }]);
        await action(request, session.data, session);
        expect(session.get(arrayName)).toEqual(saved);
      }
    },
  );

  it("reports an invalid array index rather than silently succeeding", () => {
    expect(() =>
      setProzessbevollmaechtigteType("klagende", "einzelkanzlei")(
        new Request(
          "http://localhost/klagende-partei/prozessbevollmaechtigte/0/einzelkanzlei-daten",
        ),
        {},
        createSession(),
      ),
    ).toThrow("Missing Prozessbevollmaechtigte item");
  });
});
