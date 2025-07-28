import { type ValidationErrorResponseData } from "@rvf/react-router";
import {
  type UNSAFE_DataWithResponseInit,
  type ActionFunctionArgs,
} from "react-router";
import { Result } from "true-myth";
import { flowDestination } from "~/services/flow/userFlowAction/flowDestination";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { action } from "../vorabcheck";

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validatedSession: vi.fn(),
}));

vi.mock("~/services/logging", () => ({
  logWarning: vi.fn(),
}));

vi.mock("~/services/flow/formular/fileUpload/processUserFile.server");
vi.mock("~/services/session.server");
vi.mock("~/services/flow/userFlowAction/validateFormUserData");
vi.mock("~/services/flow/userFlowAction/postValidationFlowAction");
vi.mock("~/services/flow/userFlowAction/flowDestination");

vi.mocked(getSessionManager).mockReturnValue({
  getSession: vi.fn().mockReturnValue({ get: () => ({}), set: vi.fn() }),
  commitSession: vi.fn(),
  destroySession: vi.fn(),
  getDebugId: vi.fn(),
});

const mockRequestUrl = `http://localhost:3000/fluggastrechte/formular/abgabe/start`;
const mockDefaultOptions = {
  method: "POST",
  body: new FormData(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(validatedSession).mockResolvedValue(Result.ok());
});

describe("vorabcheck.server", () => {
  describe("action", () => {
    it("should throw a response error if no CSRF token is provided", async () => {
      vi.mocked(validatedSession).mockResolvedValue(
        Result.err("Invalid CSRF token"),
      );

      const mockDefaultRequest = new Request(
        mockRequestUrl,
        mockDefaultOptions,
      );

      const thrown = await action({
        request: mockDefaultRequest,
        params: {},
        context: {},
      } as ActionFunctionArgs).catch((error) => error);

      expect(thrown).toBeInstanceOf(Response);
      expect(thrown.status).toBe(403);
      expect(logWarning).toHaveBeenCalledWith("Invalid CSRF token");
    });

    it("should return an error response in case the form data is invalid", async () => {
      vi.mocked(validateFormUserData).mockResolvedValue(
        Result.err({
          error: { fieldErrors: { name: "Name is required" } },
          submittedData: { name: "" },
        }),
      );

      const mockDefaultRequest = new Request(
        mockRequestUrl,
        mockDefaultOptions,
      );

      const response = (await action({
        request: mockDefaultRequest,
        params: {},
        context: {},
      })) as UNSAFE_DataWithResponseInit<ValidationErrorResponseData>;

      expect(response.init?.status).toBe(422);
      expect(response.data.fieldErrors).toEqual({
        name: "Name is required",
      });
      expect(response.data.repopulateFields).toEqual({ name: "" });
    });

    it("should update session once when form validation succeeds", async () => {
      vi.mocked(validateFormUserData).mockResolvedValue(
        Result.ok({
          userData: { name: "Valid Name" },
          migrationData: undefined,
        }),
      );

      const mockDefaultRequest = new Request(
        mockRequestUrl,
        mockDefaultOptions,
      );

      await action({
        request: mockDefaultRequest,
        params: {},
        context: {},
      });

      expect(updateSession).toHaveBeenCalledTimes(1);
      expect(updateSession).toHaveBeenCalledWith(expect.anything(), {
        name: "Valid Name",
      });
    });

    it("should call postValidationFormUserData once when form validation succeeds", async () => {
      vi.mocked(getSessionManager).mockReturnValue({
        getSession: vi.fn().mockReturnValue({
          data: { name: "Valid Name" },
        }),
        commitSession: vi.fn(),
        destroySession: vi.fn(),
        getDebugId: vi.fn(),
      });
      vi.mocked(validateFormUserData).mockResolvedValue(
        Result.ok({
          userData: { name: "Valid Name" },
          migrationData: undefined,
        }),
      );

      const mockDefaultRequest = new Request(
        mockRequestUrl,
        mockDefaultOptions,
      );

      await action({
        request: mockDefaultRequest,
        params: {},
        context: {},
      });

      expect(postValidationFlowAction).toHaveBeenCalledTimes(1);
      expect(postValidationFlowAction).toHaveBeenCalledWith(
        mockDefaultRequest,
        { name: "Valid Name" },
      );
    });

    it("should redirect to url /next-step in case validateFormUserData returns ok", async () => {
      vi.mocked(validateFormUserData).mockResolvedValue(
        Result.ok({
          userData: { name: "Valid Name" },
          migrationData: undefined,
        }),
      );
      vi.mocked(flowDestination).mockReturnValue("/next-step");
      const mockDefaultRequest = new Request(
        mockRequestUrl,
        mockDefaultOptions,
      );

      const response = (await action({
        request: mockDefaultRequest,
        params: {},
        context: {},
      })) as Response;

      expect(response.status).toEqual(302);
      expect(response.headers.get("location")).toEqual("/next-step");
    });
  });
});
