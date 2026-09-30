import { logWarning } from "~/services/logging";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { createSession } from "react-router";
import { ERROR_MESSAGE_TOKEN_FORM } from "~/services/security/csrf/validatedSession.server";
import { assertResponse } from "./isResponse";
import { mainSessionFromCookieHeader } from "~/services/session.server";
import { action } from "../action.geld-einklagen.reuse-beweise-document";

vi.mock("~/services/logging", () => ({
  logWarning: vi.fn(),
}));

vi.mock("~/services/session.server");

const mockCSRFToken = "mockCsrfToken";
const mockSession = createSession({
  [CSRFKey]: mockCSRFToken,
});
vi.mocked(mainSessionFromCookieHeader).mockResolvedValue(mockSession);

const actionURL =
  "http://localhost:3000/action/geld-einklagen/reuse-beweise-document";

describe("action/geld-einklagen/reuse-beweise-document router", () => {
  it("should fail if CSRF token is missing in the body", async () => {
    const bodyWithoutCsrf = new FormData();
    bodyWithoutCsrf.append("nextItemBeweis", "0");
    bodyWithoutCsrf.append("itemIndexAbschnitt", "0");
    bodyWithoutCsrf.append("reuse-option-document", "reuse");

    const request = new Request(actionURL, {
      method: "POST",
      body: bodyWithoutCsrf,
    });
    const response = await action(mockRouteArgsFromRequest(request)).catch(
      (err) => err,
    );
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(403);
    expect(logWarning).toHaveBeenCalledWith(ERROR_MESSAGE_TOKEN_FORM);
  });

  it("should return redirect for the beweis-dokument-wiederverwenden page for the reuse option", async () => {
    const formData = new FormData();
    formData.append("nextItemBeweis", "0");
    formData.append("itemIndexAbschnitt", "0");
    formData.append(CSRFKey, mockCSRFToken);
    formData.append("reuse-option-document", "reuse");

    const options = { method: "POST", body: formData };

    const request = new Request(actionURL, options);
    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/beweis-dokument-wiederverwenden",
    );
  });

  it("should return redirect for the dokumenten daten page for the new option", async () => {
    const formData = new FormData();
    formData.append("nextItemBeweis", "0");
    formData.append("itemIndexAbschnitt", "0");
    formData.append(CSRFKey, mockCSRFToken);
    formData.append("reuse-option-document", "new");

    const options = { method: "POST", body: formData };

    const request = new Request(actionURL, options);
    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/dokumenten/0/daten",
    );
  });
});
