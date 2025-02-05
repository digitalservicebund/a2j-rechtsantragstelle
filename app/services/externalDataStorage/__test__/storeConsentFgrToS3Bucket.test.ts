import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { describe, it, expect, vi } from "vitest";
import { config } from "~/services/env/env.server";
import { sendSentryMessage } from "../../logging";
import { getSessionIdByFlowId } from "../../session.server";
import { createClientS3DataStorage } from "../createClientS3DataStorage";
import { storeConsentFgrToS3Bucket } from "../storeConsentFgrToS3Bucket";

vi.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: vi.fn(),
}));

vi.mock("../createClientS3DataStorage", () => ({
  createClientS3DataStorage: vi.fn(),
}));

vi.mock("../../logging", () => ({
  sendSentryMessage: vi.fn(),
}));

vi.mock("../../session.server", () => ({
  getSessionIdByFlowId: vi.fn(),
}));

vi.mock("~/services/env/env.server", () => ({
  config: vi.fn(),
}));

const mockS3Client = { send: vi.fn() } as unknown as S3Client;

const mockRequest = new Request("http://localhost", {
  headers: {
    Cookie: "test-cookie",
    "user-agent": "test-agent",
  },
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("storeConsentFgrToS3Bucket", () => {
  it("should store consent data to S3 bucket", async () => {
    const mockDate = new Date("2025-01-01");
    vi.setSystemTime(mockDate);

    const mockSessionId = "test-session-id";
    const mockConfig = {
      ...config(),
      S3_DATA_STORAGE_BUCKET_NAME: "test-bucket",
    };
    vi.mocked(createClientS3DataStorage).mockReturnValue(mockS3Client);
    vi.mocked(getSessionIdByFlowId).mockResolvedValue(mockSessionId);
    vi.mocked(config).mockReturnValue(mockConfig);
    const mockBuffer = Buffer.from(
      `${mockSessionId};${mockDate.toISOString()};test-agent`,
      "utf8",
    );
    const mockKey = "data-consent-fgr/01-01-2025/test-session-id.csv";

    await storeConsentFgrToS3Bucket(mockRequest);

    expect(createClientS3DataStorage).toHaveBeenCalled();
    expect(getSessionIdByFlowId).toHaveBeenCalledWith(
      "/fluggastrechte/formular",
      "test-cookie",
    );

    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: mockConfig.S3_DATA_STORAGE_BUCKET_NAME,
        Body: mockBuffer,
        Key: mockKey,
      }),
    );

    expect(mockS3Client.send).toBeCalled();
  });

  it("should send a Sentry message on error", async () => {
    const mockError = new Error("Test error");

    vi.mocked(createClientS3DataStorage).mockImplementation(() => {
      throw mockError;
    });

    await storeConsentFgrToS3Bucket(mockRequest);

    expect(sendSentryMessage).toHaveBeenCalledWith(
      `Error storing consent fgr data to S3 bucket: ${mockError.message}`,
      "error",
    );
  });
});
