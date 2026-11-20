import { createSession, type ActionFunctionArgs } from "react-router";
import { Result } from "true-myth";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager } from "~/services/session.server";
import { action } from "../action.geld-einklagen.anwaltschaft.delete-antrag";

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validatedSession: vi.fn(),
}));
vi.mock("~/services/session.server", () => ({
  getSessionManager: vi.fn(),
}));
vi.mock("~/services/logging", () => ({ logWarning: vi.fn() }));

const overviewPath =
  "/geld-einklagen/anwaltschaft/sonstige-antraege/uebersicht";
const post = (
  jsEnabled = true,
  index = "0",
  {
    pathname = "/geld-einklagen/anwaltschaft/sonstige-antraege/antrag/0",
    arrayName = "sonstigeAntraege",
    redirectPathname = overviewPath,
  } = {},
) => {
  const formData = new FormData();
  formData.set("pathnameArrayItem", pathname);
  formData.set(arrayName, index);
  formData.set("_redirectPathname", redirectPathname);
  formData.set("_jsEnabled", String(jsEnabled));
  return action({
    request: new Request(
      "http://localhost/action/geld-einklagen/anwaltschaft/delete-antrag",
      {
        method: "POST",
        body: formData,
        headers: { Cookie: "flow=session" },
      },
    ),
    params: {},
    context: {},
  } as ActionFunctionArgs);
};

const target = { id: "target", antrag: "Mein Antrag" };
const remaining = { id: "remaining", antrag: "Anderer Antrag" };
const setUpSession = (
  data: Record<string, unknown> = {
    sonstigeAntraege: [target, remaining, { antrag: "Entwurf" }],
    vortraege: [{ antragId: "target" }, { antragId: "remaining" }],
  },
) => {
  const session = createSession(data);
  const getSession = vi.fn().mockResolvedValue(session);
  const commitSession = vi
    .fn()
    .mockResolvedValue(new Headers({ "Set-Cookie": "flow=updated" }));
  vi.mocked(getSessionManager).mockReturnValue({
    getSession,
    commitSession,
    destroySession: vi.fn(),
  });
  return { session, getSession, commitSession };
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(validatedSession).mockResolvedValue(Result.ok());
});

describe("delete Antrag action", () => {
  it.each([true, false])(
    "persists deletion and responds appropriately with JavaScript enabled: %s",
    async (jsEnabled) => {
      const { session, getSession, commitSession } = setUpSession();

      const response = await post(jsEnabled);

      expect(response.status).toBe(jsEnabled ? 200 : 302);
      expect(response.headers.get("Location")).toBe(
        jsEnabled ? null : overviewPath,
      );
      expect(response.headers.get("Set-Cookie")).toBe("flow=updated");
      expect(getSessionManager).toHaveBeenCalledWith(
        "/geld-einklagen/anwaltschaft",
      );
      expect(getSession).toHaveBeenCalledWith("flow=session");
      expect(commitSession).toHaveBeenCalledExactlyOnceWith(session);
      expect(session.data.sonstigeAntraege).toEqual([
        remaining,
        { antrag: "Entwurf" },
      ]);
      expect(session.data.vortraege).toEqual([{ antragId: "remaining" }]);
    },
  );

  it.each([
    ["hauptantrag", true],
    ["schmerzengeldantrag", false],
  ] as const)(
    "deletes only the selected Nebenantrag and its Vorträge from %s (JS: %s)",
    async (parentArrayName, jsEnabled) => {
      const sibling = { id: "sibling" };
      const otherParent = {
        id: "other-parent",
        nebenantraege: [{ id: "other-child" }],
      };
      const parent = {
        id: "parent",
        nebenantraege: [{ id: "nested-target" }, sibling],
      };
      const keptVortraege = [
        { antragId: "parent" },
        { antragId: "sibling" },
        { antragId: "other-child" },
      ];
      const { session, commitSession } = setUpSession({
        [parentArrayName]: [otherParent, parent],
        vortraege: [
          { antragId: "nested-target", absaetze: [{ formulierung: "Text" }] },
          ...keptVortraege,
          { antragId: "nested-target" },
        ],
      });
      const redirectPathname =
        "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/uebersicht";

      const response = await post(jsEnabled, "0", {
        pathname: `/geld-einklagen/anwaltschaft/${parentArrayName}/1`,
        arrayName: `${parentArrayName}#nebenantraege`,
        redirectPathname,
      });

      expect(response.status).toBe(jsEnabled ? 200 : 302);
      expect(response.headers.get("Location")).toBe(
        jsEnabled ? null : redirectPathname,
      );
      expect(session.data[parentArrayName]).toEqual([
        otherParent,
        { ...parent, nebenantraege: [sibling] },
      ]);
      expect(session.data.vortraege).toEqual(keptVortraege);
      expect(commitSession).toHaveBeenCalledExactlyOnceWith(session);
    },
  );

  it.each([
    ["", "0"],
    ["/5", "0"],
    ["/0", "5"],
  ])(
    "rejects a missing parent or child (parent pathname suffix %j, child index %s)",
    async (parentSuffix, childIndex) => {
      const data = {
        hauptantrag: [{ id: "parent", nebenantraege: [{ id: "child" }] }],
        vortraege: [{ antragId: "child" }],
      };
      const { session, commitSession } = setUpSession(data);
      const originalData = structuredClone(session.data);

      const response = await post(true, childIndex, {
        pathname: `/geld-einklagen/anwaltschaft/hauptantrag${parentSuffix}`,
        arrayName: "hauptantrag#nebenantraege",
      });

      expect(response.status).toBe(422);
      expect(session.data).toEqual(originalData);
      expect(commitSession).not.toHaveBeenCalled();
    },
  );

  it.each(["2", "99"])(
    "rejects a draft without an ID or a missing item at index %s",
    async (index) => {
      const { session, commitSession } = setUpSession();
      const originalData = structuredClone(session.data);

      const response = await post(true, index);

      expect(response.status).toBe(422);
      expect(await response.text()).toBe("Antrag not found or missing ID.");
      expect(session.data).toEqual(originalData);
      expect(commitSession).not.toHaveBeenCalled();
    },
  );

  it("rejects an invalid index before loading the session", async () => {
    const response = await post(true, "invalid");

    expect(response.status).toBe(422);
    expect(getSessionManager).not.toHaveBeenCalled();
  });

  it("rejects failed session validation before loading the session", async () => {
    vi.mocked(validatedSession).mockResolvedValue(
      Result.err("Invalid CSRF token"),
    );

    await expect(post()).rejects.toMatchObject({ status: 403 });
    expect(getSessionManager).not.toHaveBeenCalled();
  });
});
