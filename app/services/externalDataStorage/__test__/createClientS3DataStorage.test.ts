import { S3Client } from "@aws-sdk/client-s3";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { config } from "~/services/env/env.server";
import { createClientS3DataStorage } from "~/services/externalDataStorage/createClientS3DataStorage";

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(),
}));

vi.mock("~/services/env/env.server", () => ({
  config: vi.fn(),
}));

describe("createClientS3DataStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new S3Client instance if not already created only once", () => {
    const mockConfig = {
      ...config(),
      S3_DATA_STORAGE_ACCESS_KEY: "test-access-key",
      S3_DATA_STORAGE_SECRET_KEY: "test-secret-key",
      S3_REGION: "test-region",
      S3_ENDPOINT: "test-endpoint",
    };

    vi.mocked(config).mockReturnValue(mockConfig);

    const firstClient = createClientS3DataStorage();

    expect(S3Client).toHaveBeenCalledWith({
      region: mockConfig.S3_REGION,
      credentials: {
        accessKeyId: mockConfig.S3_DATA_STORAGE_ACCESS_KEY,
        secretAccessKey: mockConfig.S3_DATA_STORAGE_SECRET_KEY,
      },
      endpoint: mockConfig.S3_ENDPOINT,
    });
    expect(firstClient).toBeInstanceOf(S3Client);

    const secondClient = createClientS3DataStorage();
    expect(S3Client).toHaveBeenCalledTimes(1);
    expect(firstClient).toBe(secondClient);
  });
});
