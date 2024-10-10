import { createSession, type Session } from "@remix-run/node";
import { mainSessionFromCookieHeader } from "~/services/session.server";
import { CSRFKey } from "../csrfKey";
import {
  ERROR_MESSAGE_TOKEN_FORM,
  ERROR_MESSAGE_TOKEN_SESSION,
  ERROR_MESSAGE_TOKEN_SESSION_NOT_MATCH,
  validatedSession,
} from "../validatedSession.server";

vi.mock("~/services/session.server");

const mockMainSessionFromCookieHeader = (sessionMocked: Session) => {
  vi.mocked(mainSessionFromCookieHeader).mockResolvedValue(sessionMocked);
};

describe("validatedSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return a result error in case is missing the csfr in the form", async () => {
    const mockSession: Session = createSession();
    mockMainSessionFromCookieHeader(mockSession);
    const formData = new FormData();

    const options = {
      method: "POST",
      body: formData,
    };

    const request = new Request("http://localhost:3000", options);

    const actual = await validatedSession(request);
    expect(actual.isErr).toBe(true);
    expect(actual.isErr ? actual.error : "").toEqual(ERROR_MESSAGE_TOKEN_FORM);
  });

  it("should return a result error in case is missing the csrf token in the session", async () => {
    const mockSession: Session = createSession();
    mockMainSessionFromCookieHeader(mockSession);
    const formData = new FormData();
    formData.append(CSRFKey, "csrf");

    const options = {
      method: "POST",
      body: formData,
    };

    const request = new Request("http://localhost:3000", options);

    const actual = await validatedSession(request);
    expect(actual.isErr).toBe(true);
    expect(actual.isErr ? actual.error : "").toEqual(
      ERROR_MESSAGE_TOKEN_SESSION,
    );
  });

  it("should return a result error in case is missing the csrf token in the form", async () => {
    const mockSession: Session = createSession();
    mockMainSessionFromCookieHeader(mockSession);
    mockSession.set(CSRFKey, "anotherCsrf");
    const formData = new FormData();
    formData.append(CSRFKey, "csrf");

    const options = {
      method: "POST",
      body: formData,
    };

    const request = new Request("http://localhost:3000", options);

    const actual = await validatedSession(request);
    expect(actual.isErr).toBe(true);
    expect(actual.isErr ? actual.error : "").toEqual(
      ERROR_MESSAGE_TOKEN_SESSION_NOT_MATCH,
    );
  });

  it("should return a result ok in case everything is ok", async () => {
    const mockSession: Session = createSession();
    mockMainSessionFromCookieHeader(mockSession);
    mockSession.set(CSRFKey, "csrf");
    const formData = new FormData();
    formData.append(CSRFKey, "csrf");

    const options = {
      method: "POST",
      body: formData,
    };

    const request = new Request("http://localhost:3000", options);

    const actual = await validatedSession(request);
    expect(actual.isOk).toBe(true);
  });
});
