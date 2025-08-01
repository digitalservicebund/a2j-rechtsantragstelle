import { Result } from "true-myth";
import { getPrunedUserDataFromPathname } from "~/services/flow/getPrunedUserDataFromPathname";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { getSessionManager } from "~/services/session.server";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { getUserDataAndFlow } from "../getUserDataAndFlow";
import { validateStepIdFlow } from "../validateStepIdFlow";

vi.mock("~/services/flow/server/buildFlowController");
vi.mock("~/services/session.server");
vi.mock("~/services/flow/getPrunedUserDataFromPathname");
vi.mock("../validateStepIdFlow");
vi.mock("~/services/session.server/crossFlowMigration");

const mockRequest = new Request(
  "http://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
);

const mockBuildFlowController = vi.fn() as unknown as ReturnType<
  typeof buildFlowController
>;

const mockPrunerData = {
  userDataWithPageData: {
    name: "someName",
    pageData: { arrayIndexes: [] },
  },
  validFlowPaths: {
    "/grundvoraussetzungen/klage-eingereicht": {
      isArrayPage: false,
    },
  },
};

const mockMigrationUserData = {
  name: "migrationName",
};

const mockEmailCaptureConsent = true;

vi.mocked(getPrunedUserDataFromPathname).mockResolvedValue(mockPrunerData);
vi.mocked(buildFlowController).mockReturnValue(mockBuildFlowController);
vi.mocked(getSessionManager).mockReturnValue({
  getSession: vi.fn().mockResolvedValue({
    get: vi.fn(() => mockEmailCaptureConsent),
  }),
  commitSession: vi.fn(),
  destroySession: vi.fn(),
  getDebugId: vi.fn(),
});

describe("getUserDataAndFlow", () => {
  it("should return an error and redirect in case the stepId is not valid", async () => {
    vi.mocked(validateStepIdFlow).mockResolvedValue(
      Result.err({ redirectTo: "redirectToPage" }),
    );

    const result = await getUserDataAndFlow(mockRequest);

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe("redirectToPage");
  });

  it("should return ok and with all the correct data", async () => {
    vi.mocked(validateStepIdFlow).mockResolvedValue(Result.ok());
    vi.mocked(getMigrationData).mockResolvedValue(undefined);

    const result = await getUserDataAndFlow(mockRequest);

    expect(result.isOk).toBe(true);
    expect(result.isOk ? result.value : undefined).toMatchObject({
      userData: mockPrunerData.userDataWithPageData,
      flow: {
        id: "/beratungshilfe/antrag",
        controller: mockBuildFlowController,
        validFlowPaths: mockPrunerData.validFlowPaths,
      },
      emailCaptureConsent: mockEmailCaptureConsent,
      page: {
        stepId: "/finanzielle-angaben/kinder/uebersicht",
        arrayIndexes: [],
      },
    });
  });

  it("should return Ok with expected migration object when migration data exists", async () => {
    vi.mocked(validateStepIdFlow).mockResolvedValue(Result.ok());
    vi.mocked(getMigrationData).mockResolvedValue(mockMigrationUserData);

    const result = await getUserDataAndFlow(mockRequest);

    expect(result.isOk).toBe(true);
    expect(result.isOk ? result.value : undefined).toMatchObject({
      migration: {
        userData: mockMigrationUserData,
        sortedFields: undefined,
        buttonUrl: undefined,
      },
    });
  });
});
