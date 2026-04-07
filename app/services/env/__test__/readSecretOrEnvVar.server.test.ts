import fs from "node:fs";
import { readSecretOrEnvVar } from "../readSecretOrEnvVar.server";

vi.mock("node:fs");

describe("readSecretOrEnvVar", () => {
  const mockedReadFileSync = vi.fn();
  vi.mocked(fs.readFileSync).mockImplementation(mockedReadFileSync);

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads trimmed from filesystem", () => {
    mockedReadFileSync.mockReturnValueOnce(" readFromDisk\n ");
    expect(readSecretOrEnvVar("/mock/path", "ENV_VAR")).toBe("readFromDisk");
    expect(mockedReadFileSync).toHaveBeenCalledWith("/mock/path", "utf8");
  });

  it("reads trimmed from environment variables if file-read fails with ENOENT", () => {
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      const err = new Error("File Not Found") as NodeJS.ErrnoException;
      err.code = "ENOENT";
      throw err;
    });
    vi.stubEnv("ENV_VAR", " readFromEnvVar");
    expect(readSecretOrEnvVar("/mock/path", "ENV_VAR")).toBe("readFromEnvVar");
  });

  it("falls back to env var if file is empty or whitespace-only", () => {
    mockedReadFileSync.mockReturnValueOnce("   ");
    vi.stubEnv("ENV_VAR", "readFromEnvVar");
    expect(readSecretOrEnvVar("/mock/path", "ENV_VAR")).toBe("readFromEnvVar");
  });

  it("re-throws errors other than ENOENT", () => {
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      const err = new Error("Permission denied") as NodeJS.ErrnoException;
      err.code = "EACCES";
      throw err;
    });
    expect(() => readSecretOrEnvVar("/mock/path", "ENV_VAR")).toThrow(
      "Permission denied",
    );
  });
});
