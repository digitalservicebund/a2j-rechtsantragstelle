import { type ActionFunctionArgs } from "react-router";
import { Result } from "true-myth";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import {
  deleteArrayItem,
  getArrayDataFromFormData,
} from "~/services/session.server/arrayDeletion";
import { action } from "../action.delete-array-item";

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validatedSession: vi.fn(),
}));

vi.mock("~/services/session.server/arrayDeletion", () => ({
  getArrayDataFromFormData: vi.fn(),
  deleteArrayItem: vi.fn(),
}));

vi.mock("~/services/logging", () => ({
  logWarning: vi.fn(),
}));

vi.mock("~/services/session.server", () => ({
  getSessionManager: vi.fn().mockReturnValue({
    getSession: vi.fn().mockReturnValue({ get: () => ({}), set: vi.fn() }),
    commitSession: vi.fn(),
  }),
}));

const formData = new FormData();
formData.append("_jsEnabled", "true");
const mockRequestUrl = `http://localhost:3000/action/delete-array-item`;

const options = {
  method: "POST",
  body: formData,
};

const mockSuccessfulExternalFunctions = () => {
  vi.mocked(validatedSession).mockResolvedValue(Result.ok());
  vi.mocked(getArrayDataFromFormData).mockReturnValue(
    Result.ok({
      arrayName: "testArray",
      index: 0,
      flowId: "/beratungshilfe/antrag",
      pathname: "/beratungshilfe/antrag/array",
    }),
  );
  vi.mocked(deleteArrayItem).mockReturnValue(Result.ok());
};

beforeEach(() => {
  vi.clearAllMocks();
  mockSuccessfulExternalFunctions();
});

describe("/action/delete-array-item route", () => {
  it("should thrown a response error in case does not have a csrf token", async () => {
    vi.mocked(validatedSession).mockResolvedValue(
      Result.err("Invalid CSRF token"),
    );

    const request = new Request(mockRequestUrl, options);

    const thrown = await action({
      request,
      params: {},
      context: {},
    } as ActionFunctionArgs).catch((error) => error);

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(403);
    expect(logWarning).toHaveBeenCalledWith("Invalid CSRF token");
  });

  it("should thrown a response error in case getArrayDataFromFormData returns an error", async () => {
    vi.mocked(getArrayDataFromFormData).mockReturnValue(
      Result.err({ message: "Error" }),
    );

    const request = new Request(mockRequestUrl, options);

    const thrown = await action({
      request,
      params: {},
      context: {},
    } as ActionFunctionArgs).catch((error) => error);

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(422);
  });

  it("should thrown a response error in case deleteArrayItem returns an error", async () => {
    vi.mocked(deleteArrayItem).mockReturnValue(
      Result.err({ message: "Deletion error" }),
    );

    const request = new Request(mockRequestUrl, options);

    const thrown = await action({
      request,
      params: {},
      context: {},
    } as ActionFunctionArgs).catch((error) => error);

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(422);
  });

  it("should return a response with status 200 in case no problem happens", async () => {
    const request = new Request(mockRequestUrl, options);

    const response = await action({
      request,
      params: {},
      context: {},
    } as ActionFunctionArgs);

    expect(response.status).toEqual(200);
  });

  it("should return a response with status 302 in case no problem happens and _jsEnabled is false", async () => {
    const formDataWithoutJS = new FormData();
    formDataWithoutJS.append("_jsEnabled", "false");
    const options = {
      method: "POST",
      body: formDataWithoutJS,
    };

    const request = new Request(mockRequestUrl, options);

    const response = await action({
      request,
      params: {},
      context: {},
    } as ActionFunctionArgs);

    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      "/beratungshilfe/antrag/array",
    );
  });
});
