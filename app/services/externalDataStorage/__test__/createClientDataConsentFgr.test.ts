import { S3Client } from "@aws-sdk/client-s3";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { config } from "~/services/env/env.server";
import { createClientDataConsentFgr } from "~/services/externalDataStorage/createClientDataConsentFgr";

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(),
}));

vi.mock("~/services/env/env.server", () => ({
  config: vi.fn(),
}));

describe("createClientDataConsentFgr", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new S3Client instance if not already created only once", () => {
    const mockConfig = {
      ...config(),
      AWS_S3_DATA_CONSENT_FGR_ACCESS_KEY: "test-access-key",
      AWS_S3_DATA_CONSENT_FGR_SECRET_KEY: "test-secret-key",
      AWS_S3_REGION: "test-region",
      AWS_S3_ENDPOINT: "test-endpoint",
    };

    vi.mocked(config).mockReturnValue(mockConfig);

    const firstClient = createClientDataConsentFgr();

    expect(S3Client).toHaveBeenCalledWith({
      region: mockConfig.AWS_S3_REGION,
      credentials: {
        accessKeyId: mockConfig.AWS_S3_DATA_CONSENT_FGR_ACCESS_KEY,
        secretAccessKey: mockConfig.AWS_S3_DATA_CONSENT_FGR_SECRET_KEY,
      },
      endpoint: mockConfig.AWS_S3_ENDPOINT,
    });
    expect(firstClient).toBeInstanceOf(S3Client);

    const secondClient = createClientDataConsentFgr();
    expect(S3Client).toHaveBeenCalledTimes(1);
    expect(firstClient).toBe(secondClient);
  });
});
