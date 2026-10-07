import { logWarning } from "~/services/logging";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";
import { action } from "../action.geld-einklagen.reuse-beweise-person";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { createSession } from "react-router";
import { ERROR_MESSAGE_TOKEN_FORM } from "~/services/security/csrf/validatedSession.server";
import { assertResponse, assertValidationError } from "./isResponse";
import {
  getSessionManager,
  mainSessionFromCookieHeader,
  updateSession,
} from "~/services/session.server";

vi.mock("~/services/logging", () => ({
  logWarning: vi.fn(),
}));

vi.mock("~/services/session.server");

const mockSessionManager = (mockSession: any) => {
  vi.mocked(getSessionManager).mockReturnValue({
    getSession: vi.fn().mockResolvedValue(mockSession),
    commitSession: vi.fn(),
    updateSession: vi.fn(),
  } as any);
};

const mockCSRFToken = "mockCsrfToken";
const mockSession = createSession({
  [CSRFKey]: mockCSRFToken,
});
vi.mocked(mainSessionFromCookieHeader).mockResolvedValue(mockSession);

const actionURL =
  "http://localhost:3000/action/geld-einklagen/reuse-beweise-person";

describe("action/geld-einklagen/reuse-beweise-person route", () => {
  it("should fail if CSRF token is missing in the body", async () => {
    const bodyWithoutCsrf = new FormData();
    bodyWithoutCsrf.append("nextItemBeweis", "0");
    bodyWithoutCsrf.append("itemIndexAbschnitt", "0");
    bodyWithoutCsrf.append("reuse-option-person", "reuse");

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

  it("should fail if reuse-option parameter does not exist in the body", async () => {
    const formData = new FormData();
    formData.append("nextItemBeweis", "0");
    formData.append("itemIndexAbschnitt", "0");
    formData.append(CSRFKey, mockCSRFToken);

    const options = { method: "POST", body: formData };
    const request = new Request(actionURL, options);
    const response = await action(mockRouteArgsFromRequest(request));
    assertValidationError(response);
    expect(response.init?.status).toBe(422);
  });

  it("should return redirect for the beweis-person-wiederverwenden page for the reuse option", async () => {
    const formData = new FormData();
    formData.append("nextItemBeweis", "0");
    formData.append("itemIndexAbschnitt", "0");
    formData.append(CSRFKey, mockCSRFToken);
    formData.append("reuse-option-person", "reuse");

    const options = { method: "POST", body: formData };

    const request = new Request(actionURL, options);
    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/beweis-person-wiederverwenden",
    );
  });

  it("should return redirect for the uebersicht page and create a beklagte person", async () => {
    const formData = new FormData();
    formData.append("nextItemBeweis", "0");
    formData.append("itemIndexAbschnitt", "0");
    formData.append(CSRFKey, mockCSRFToken);
    formData.append("reuse-option-person", "beklagte");

    const options = { method: "POST", body: formData };

    const request = new Request(actionURL, options);

    const userDataMock = {
      data: {
        abschnitte: [
          {
            beschreibung: "",
          },
        ],
      },
    };

    mockSessionManager(userDataMock);

    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/uebersicht#array-summary-item-edit-abschnitte-0",
    );

    expect(updateSession).toHaveBeenCalledWith(
      userDataMock,
      expect.objectContaining({
        abschnitte: [
          {
            beschreibung: "",
            personen: [
              {
                personAuswahl: "beklagte",
                personId: expect.anything(),
              },
            ],
          },
        ],
      }),
    );
  });

  it("should return redirect for the uebersicht page and create a klagende person", async () => {
    const formData = new FormData();
    formData.append("nextItemBeweis", "0");
    formData.append("itemIndexAbschnitt", "0");
    formData.append(CSRFKey, mockCSRFToken);
    formData.append("reuse-option-person", "klagende");

    const options = { method: "POST", body: formData };
    const request = new Request(actionURL, options);

    const userDataMock = {
      data: {
        abschnitte: [
          {
            beschreibung: "",
          },
        ],
      },
    };

    mockSessionManager(userDataMock);

    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/uebersicht#array-summary-item-edit-abschnitte-0",
    );

    expect(updateSession).toHaveBeenCalledWith(
      userDataMock,
      expect.objectContaining({
        abschnitte: [
          {
            beschreibung: "",
            personen: [
              {
                personAuswahl: "klagende",
                personId: expect.anything(),
              },
            ],
          },
        ],
      }),
    );
  });

  it("should return redirect for the personen daten page and create a new", async () => {
    const formData = new FormData();
    formData.append("nextItemBeweis", "0");
    formData.append("itemIndexAbschnitt", "0");
    formData.append(CSRFKey, mockCSRFToken);
    formData.append("reuse-option-person", "new");

    const options = { method: "POST", body: formData };
    const request = new Request(actionURL, options);

    const userDataMock = {
      data: {
        abschnitte: [
          {
            beschreibung: "",
          },
        ],
      },
    };

    mockSessionManager(userDataMock);

    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/personen/0/daten",
    );

    expect(updateSession).toHaveBeenCalledWith(
      userDataMock,
      expect.objectContaining({
        abschnitte: [
          {
            beschreibung: "",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "",
                title: "",
                vorname: "",
                nachname: "",
                strasse: "",
                hausnummer: "",
                plz: "",
                ort: "",
                land: "",
                telefonnummer: "",
                email: "",
                personId: expect.anything(),
              },
            ],
          },
        ],
      }),
    );
  });
});
