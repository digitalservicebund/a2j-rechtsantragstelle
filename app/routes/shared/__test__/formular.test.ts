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
import { uploadUserFile } from "~/services/upload/fileUploadHelpers.server";
import { action } from "../formular";

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validatedSession: vi.fn(),
}));

vi.mock("~/services/logging", () => ({
  logWarning: vi.fn(),
}));

vi.mock("~/services/flow/server/buildFlowController");
vi.mock("~/services/upload/fileUploadHelpers.server");
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

const mockDefaultRequest = new Request(mockRequestUrl, mockDefaultOptions);

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(validatedSession).mockResolvedValue(Result.ok());
});

describe("formular.server", () => {
  describe("action", () => {
    it("should throw a response error if no CSRF token is provided", async () => {
      vi.mocked(validatedSession).mockResolvedValue(
        Result.err("Invalid CSRF token"),
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

    describe("file actions", () => {
      it("should return an error response when a file upload fails", async () => {
        vi.mocked(uploadUserFile).mockResolvedValue({
          fieldErrors: { file: "File upload failed" },
          repopulateFields: { file: "someFile" },
        });

        const formData = new FormData();
        formData.append("_action", "fileUpload");
        const options = {
          method: "POST",
          body: formData,
        };

        const request = new Request(mockRequestUrl, options);

        const response = (await action({
          request,
          params: {},
          context: {},
        })) as UNSAFE_DataWithResponseInit<ValidationErrorResponseData>;

        expect(response.init?.status).toBe(422);
        expect(response.data.fieldErrors).toEqual({
          file: "File upload failed",
        });
        expect(response.data.repopulateFields).toEqual({ file: "someFile" });
      });

      it("should return 200 and update the session when a file upload succeeds", async () => {
        vi.mocked(uploadUserFile).mockResolvedValue({
          userData: { file: "someFile" },
        });

        const formData = new FormData();
        formData.append("_action", "fileUpload.file");

        const request = new Request(mockRequestUrl, {
          method: "POST",
          body: formData,
        });

        const response = (await action({
          request,
          params: {},
          context: {},
        })) as UNSAFE_DataWithResponseInit<ValidationErrorResponseData>;

        expect(response.init?.status).toBe(200);
        expect(updateSession).toHaveBeenCalledTimes(1);
        expect(updateSession).toHaveBeenCalledWith(expect.anything(), {
          file: "someFile",
        });
      });
    });

    describe("user flow actions", () => {
      it("should return an error response in case the form data is invalid", async () => {
        vi.mocked(validateFormUserData).mockResolvedValue(
          Result.err({
            error: { fieldErrors: { name: "Name is required" } },
            submittedData: { name: "" },
          }),
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

      it("should update session twice when form validation succeeds with migration data", async () => {
        vi.mocked(validateFormUserData).mockResolvedValue(
          Result.ok({
            userData: { name: "Valid Name" },
            migrationData: { name: "Migration Name" },
          }),
        );

        await action({
          request: mockDefaultRequest,
          params: {},
          context: {},
        });

        expect(updateSession).toHaveBeenCalledTimes(2);
        expect(updateSession).toHaveBeenCalledWith(expect.anything(), {
          name: "Valid Name",
        });

        expect(updateSession).toHaveBeenCalledWith(expect.anything(), {
          name: "Migration Name",
        });
      });

      it("should call postValidationFormUserData once when form validation succeeds", async () => {
        vi.mocked(validateFormUserData).mockResolvedValue(
          Result.ok({
            userData: { name: "Valid Name" },
            migrationData: { name: "Migration Name" },
          }),
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
            migrationData: { name: "Migration Name" },
          }),
        );
        vi.mocked(flowDestination).mockReturnValue("/next-step");

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
});
