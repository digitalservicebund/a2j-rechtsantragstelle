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

vi.mock("~/services/env/env.server", () => ({
  config: vi.fn(),
}));

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
  const mockSessionId = "test-session-id";
  const mockS3Client = { send: vi.fn() } as unknown as S3Client;

  const mockConfig = {
    ...config(),
    S3_DATA_STORAGE_BUCKET_NAME: "test-bucket",
  };
  vi.mocked(createClientS3DataStorage).mockReturnValue(mockS3Client);
  vi.mocked(config).mockReturnValue(mockConfig);

  describe("uploadUserFileToS3", () => {
    it("stores user uploaded file to S3 bucket", async () => {
      const mockKey = `user-files${mockFlowId}/${mockSessionId}/${mockUUID}`;

      await uploadUserFileToS3(mockSessionId, mockFlowId, mockFileArrayBuffer);
      expect(createClientS3DataStorage).toHaveBeenCalled();

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
      await deleteUserFileFromS3(mockSessionId, mockFlowId, mockUUID);
      expect(createClientS3DataStorage).toHaveBeenCalled();

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
