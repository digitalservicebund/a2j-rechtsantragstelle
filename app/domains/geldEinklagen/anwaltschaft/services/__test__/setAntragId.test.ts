import get from "lodash/get";
import { createSession, type Session } from "react-router";
import { geldEinklagenAnwaltschaft } from "../../index";
import { setAntragId } from "../setAntragId";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(
    (session: Session, userData: Record<string, unknown>) => {
      for (const [key, value] of Object.entries(userData))
        session.set(key, value);
    },
  ),
}));

const baseUrl = "http://localhost/geld-einklagen/anwaltschaft";

describe("setAntragId", () => {
  it.each([
    {
      stepId:
        "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/hauptantrag/#/daten",
      path: "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/hauptantrag/1/daten",
      arrayName: "hauptantrag",
      itemPath: [1],
    },
    {
      stepId:
        "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege/#/daten",
      path: "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege/1/daten",
      arrayName: "schmerzengeldantrag",
      itemPath: [1],
    },
    {
      stepId:
        "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/#/nebenantraege/#/daten",
      path: "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/1/nebenantraege/0/daten",
      arrayName: "schmerzengeldantrag",
      itemPath: [1, "nebenantraege", 0],
    },
    {
      stepId: "/sonstige-antraege/antrag/#/daten",
      path: "/sonstige-antraege/antrag/1/daten",
      arrayName: "sonstigeAntraege",
      itemPath: [1],
    },
  ] as const)(
    "assigns a stable ID to the submitted $arrayName item",
    async ({ stepId, path, arrayName, itemPath }) => {
      const userData = {
        [arrayName]: [
          { id: "existing", nebenantraege: [] },
          { id: "", nebenantraege: [{ id: "" }] },
        ],
      };
      const session = createSession(userData);
      const action = geldEinklagenAnwaltschaft.posFlowActions[stepId];
      const request = new Request(`${baseUrl}${path}`);
      const getId = () =>
        get(session.get(arrayName), [...itemPath, "id"]) as unknown;

      await action(request, userData, session);
      const assignedId = getId();
      expect(assignedId).toMatch(/^[0-9a-f-]{36}$/);
      expect(get(session.data, [arrayName, 0, "id"])).toBe("existing");

      await action(request, session.data, session);
      expect(getId()).toBe(assignedId);
    },
  );

  it.each(["/hauptantrag/daten", "/hauptantrag/2/daten"])(
    "rejects a missing Antrag at %s",
    (path) => {
      const userData = { hauptantrag: [{}] };

      expect(() =>
        setAntragId("hauptantrag")(
          new Request(`${baseUrl}${path}`),
          userData,
          createSession(userData),
        ),
      ).toThrow("Missing Antrag item");
    },
  );
});
