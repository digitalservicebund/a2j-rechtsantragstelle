import { createSession, type ActionFunctionArgs } from "react-router";
import { Result } from "true-myth";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager } from "~/services/session.server";
import { action } from "../action.geld-einklagen.anwaltschaft.add-vortrag";

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validatedSession: vi.fn(),
}));
vi.mock("~/services/session.server", () => ({
  getSessionManager: vi.fn(),
}));

describe("add Vortrag action", () => {
  it.each([true, false])(
    "opens the linked Vortrag at the correct index when it already exists: %s",
    async (hasLinkedVortrag) => {
      const unrelated = { antragId: "unrelated" };
      const linked = { antragId: "target", absaetze: [] };
      const session = createSession({
        sonstigeAntraege: [{ id: "target", antrag: "Mein Antrag" }],
        vortraege: hasLinkedVortrag ? [unrelated, linked] : [unrelated],
      });
      const commitSession = vi.fn().mockResolvedValue(new Headers());
      vi.mocked(validatedSession).mockResolvedValue(Result.ok());
      vi.mocked(getSessionManager).mockReturnValue({
        getSession: vi.fn().mockResolvedValue(session),
        commitSession,
        destroySession: vi.fn(),
      });
      const formData = new FormData();
      formData.set("antragKey", "sonstigeAntraege.0");

      const response = await action({
        request: new Request(
          "http://localhost/action/geld-einklagen/anwaltschaft/add-vortrag",
          { method: "POST", body: formData },
        ),
        params: {},
        context: {},
      } as ActionFunctionArgs);

      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe(
        "/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/vortraege/1/absaetze",
      );
      expect(session.data.vortraege).toEqual([
        unrelated,
        hasLinkedVortrag ? linked : { antragId: "target" },
      ]);
      expect(commitSession).toHaveBeenCalledExactlyOnceWith(session);
    },
  );
});
