import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FlowId } from "~/domains/flowIds";
import { config } from "~/services/env/env.server";
import { uploadUserFileToS3 } from "~/services/externalDataStorage/storeUserFileToS3Bucket";
import { sendSentryMessage } from "../../logging";
import { getSessionIdByFlowId } from "../../session.server";
import { createClientS3DataStorage } from "../createClientS3DataStorage";

vi.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: vi.fn(),
}));

let mockFlowId: FlowId | undefined = "/prozesskostenhilfe/formular";
vi.mock("~/domains/flowIds", () => ({
  parsePathname: vi.fn(),
  flowIdFromPathname: vi.fn(() => mockFlowId),
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

const mockCookie = "test-cookie";
const mockRequest = new Request("http://localhost", {
  headers: {
    Cookie: mockCookie,
    "user-agent": "test-agent",
  },
});

const setupFileMocks = (
  mockSessionId: string,
  mockConfig: ReturnType<typeof config>,
) => {
  vi.mocked(createClientS3DataStorage).mockReturnValue(mockS3Client);
  vi.mocked(getSessionIdByFlowId).mockResolvedValue(mockSessionId);
  vi.mocked(config).mockReturnValue(mockConfig);
};

beforeEach(() => {
  vi.clearAllMocks();
});

const mockBuffer = Buffer.from("", "utf8");
const mockAsyncIterator = {
  [Symbol.asyncIterator]: function () {
    return {
      next: vi.fn(() => Promise.resolve({ done: true, value: mockBuffer })),
    };
  },
};

describe("storeUserFileToS3Bucket", () => {
  it("stores user uploaded file to S3 bucket", async () => {
    const mockSessionId = "test-session-id";
    const mockConfig = {
      ...config(),
      S3_DATA_STORAGE_BUCKET_NAME: "test-bucket",
    };
    const mockKey = `user-files/${mockFlowId}/${mockSessionId}`;

    setupFileMocks(mockSessionId, mockConfig);

    await uploadUserFileToS3(mockRequest, mockAsyncIterator);

    expect(createClientS3DataStorage).toHaveBeenCalled();
    expect(getSessionIdByFlowId).toHaveBeenCalledWith(mockFlowId, mockCookie);

    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: mockConfig.S3_DATA_STORAGE_BUCKET_NAME,
        Body: mockBuffer,
        Key: mockKey,
      }),
    );

    expect(mockS3Client.send).toBeCalled();
  });

  it("handles error if called from outside a valid flowId", async () => {
    const mockError = new Error(
      "Attempted to upload user file outside of known flow",
    );

    mockFlowId = undefined;

    const mockSessionId = "test-session-id";
    const mockConfig = {
      ...config(),
      S3_DATA_STORAGE_BUCKET_NAME: "test-bucket",
    };
    setupFileMocks(mockSessionId, mockConfig);

    await uploadUserFileToS3(mockRequest, mockAsyncIterator);

    expect(sendSentryMessage).toHaveBeenCalledWith(
      `Error storing user uploaded file to S3 bucket: ${mockError.message}`,
      "error",
    );
  });
});
