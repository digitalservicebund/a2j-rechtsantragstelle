import fs from "node:fs";
import { config } from "~/services/env/env.server";

vi.mock("node:fs");
const mockedReadFileSync = vi.fn();
vi.mocked(fs.readFileSync).mockImplementation(mockedReadFileSync);

const envMap: Array<[keyof ReturnType<typeof config>, string, string]> = [
  ["STRAPI_API", "/etc/strapi-api-secret/password", "test://cms/api/"],
  [
    "STRAPI_ACCESS_KEY",
    "/etc/strapi-access-key-secret/password",
    "FAKE_STRAPI_ACCESS_KEY",
  ],
  [
    "GERICHTSFINDER_ENCRYPTION_KEY",
    "/etc/courtdata-secrets/password",
    "FAKE_GERICHTSFINDER_KEY",
  ],
  [
    "REDIS_PASSWORD",
    "/etc/redis-password-secret/password",
    "FAKE_REDIS_PASSWORD",
  ],
  [
    "COOKIE_SESSION_SECRET",
    "/etc/cookie-session-secret/password",
    "FAKE_COOKIE_SESSION_SECRET",
  ],
  ["SAML_IDP_CERT", "/etc/saml/idp_cert", "FAKE_SAML_IDP_CERT"],
  [
    "S3_DATA_STORAGE_ACCESS_KEY",
    "/etc/s3-storage-credentials-secret-access-key/password",
    "FAKE_S3_DATA_STORAGE_ACCESS_KEY",
  ],
  [
    "S3_DATA_STORAGE_SECRET_KEY",
    "/etc/s3-storage-credentials-secret-key/password",
    "FAKE_S3_DATA_STORAGE_SECRET_KEY",
  ],
];

describe("environment variables", () => {
  describe.each(envMap)("%s", (key, path, value) => {
    beforeEach(() => {
      mockedReadFileSync.mockReturnValue(undefined);
    });
    it("can be read from a local file", () => {
      mockedReadFileSync.mockReturnValue(value);
      expect(config()[key]).toBe(value);
      expect(mockedReadFileSync).toHaveBeenCalledWith(path, "utf8");
    });

    it("can be read from process.env when local file is missing", () => {
      vi.stubEnv(key, value);
      expect(config()[key]).toBe(value);
    });

    it("return a default empty string", () => {
      vi.stubEnv(key, undefined);
      expect(config()[key]).toBe("");
    });
  });
});
