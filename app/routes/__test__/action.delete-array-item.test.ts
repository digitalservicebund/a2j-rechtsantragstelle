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

const options = {
  method: "POST",
  body: formData,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("/action/delete-array-item route", () => {
  it("should thrown a response error in case does not have a csrf token", async () => {
    vi.mocked(validatedSession).mockResolvedValue(
      Result.err("Invalid CSRF token"),
    );

    const request = new Request(
      `http://localhost:3000/action/delete-array-item`,
      options,
    );

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
    vi.mocked(validatedSession).mockResolvedValue(Result.ok());
    vi.mocked(getArrayDataFromFormData).mockReturnValue(
      Result.err({ message: "Error" }),
    );

    const request = new Request(
      `http://localhost:3000/action/delete-array-item`,
      options,
    );

    const thrown = await action({
      request,
      params: {},
      context: {},
    } as ActionFunctionArgs).catch((error) => error);

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(422);
  });

  it("should thrown a response error in case deleteArrayItem returns an error", async () => {
    vi.mocked(validatedSession).mockResolvedValue(Result.ok());
    vi.mocked(getArrayDataFromFormData).mockReturnValue(
      Result.ok({
        arrayName: "testArray",
        index: 0,
        flowId: "/beratungshilfe/antrag",
      }),
    );
    vi.mocked(deleteArrayItem).mockReturnValue(
      Result.err({ message: "Deletion error" }),
    );

    const request = new Request(
      `http://localhost:3000/action/delete-array-item`,
      options,
    );

    const thrown = await action({
      request,
      params: {},
      context: {},
    } as ActionFunctionArgs).catch((error) => error);

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(422);
  });

  it("should return a response with status 200 in case no problem happens", async () => {
    vi.mocked(validatedSession).mockResolvedValue(Result.ok());
    vi.mocked(getArrayDataFromFormData).mockReturnValue(
      Result.ok({
        arrayName: "testArray",
        index: 0,
        flowId: "/beratungshilfe/antrag",
      }),
    );
    vi.mocked(deleteArrayItem).mockReturnValue(Result.ok());

    const request = new Request(
      `http://localhost:3000/action/delete-array-item`,
      options,
    );

    const response = await action({
      request,
      params: {},
      context: {},
    } as ActionFunctionArgs);

    expect(response.status).toEqual(200);
  });
});
