import {
  DeleteObjectCommand,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { type FlowId } from "~/domains/flowIds";
import { config } from "~/services/env/env.server";
import {
  deleteUserFileFromS3,
  uploadUserFileToS3,
} from "~/services/externalDataStorage/userFileS3Helpers";
import { getSessionIdByFlowId } from "../../session.server";
import { createClientS3DataStorage } from "../createClientS3DataStorage";

vi.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: vi.fn(),
  DeleteObjectCommand: vi.fn(),
}));

const mockFlowId: FlowId = "/prozesskostenhilfe/formular";
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

const mockFileArrayBuffer = new ArrayBuffer(8);

const mockUUID = "some-fancy-uuid";
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => mockUUID,
  },
});

describe("userFileS3Helpers", () => {
  describe("uploadUserFileToS3", () => {
    it("stores user uploaded file to S3 bucket", async () => {
      const mockSessionId = "test-session-id";
      const mockConfig = {
        ...config(),
        S3_DATA_STORAGE_BUCKET_NAME: "test-bucket",
      };
      const mockKey = `user-files${mockFlowId}/${mockSessionId}/${mockUUID}`;

      setupFileMocks(mockSessionId, mockConfig);

      await uploadUserFileToS3(mockCookie, mockFlowId, mockFileArrayBuffer);

      expect(createClientS3DataStorage).toHaveBeenCalled();
      expect(getSessionIdByFlowId).toHaveBeenCalledWith(mockFlowId, mockCookie);

      expect(PutObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: mockConfig.S3_DATA_STORAGE_BUCKET_NAME,
          Body: new Uint8Array(mockFileArrayBuffer),
          Key: mockKey,
        }),
      );

      expect(mockS3Client.send).toBeCalled();
    });
  });

  describe("deleteUserFileFromS3", () => {
    it("should successfully delete a user file", async () => {
      const mockSessionId = "test-session-id";
      const mockConfig = {
        ...config(),
        S3_DATA_STORAGE_BUCKET_NAME: "test-bucket",
      };

      setupFileMocks(mockSessionId, mockConfig);
      await deleteUserFileFromS3(mockCookie, mockFlowId, mockUUID);

      expect(createClientS3DataStorage).toHaveBeenCalled();
      expect(getSessionIdByFlowId).toHaveBeenCalledWith(mockFlowId, mockCookie);

      expect(DeleteObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: mockConfig.S3_DATA_STORAGE_BUCKET_NAME,
          Key: `user-files${mockFlowId}/${mockSessionId}/${mockUUID}`,
        }),
      );

      expect(mockS3Client.send).toBeCalled();
    });
  });
});
