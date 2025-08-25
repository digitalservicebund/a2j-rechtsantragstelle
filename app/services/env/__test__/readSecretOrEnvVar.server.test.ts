import fs from "node:fs";
import { readSecretOrEnvVar } from "../readSecretOrEnvVar.server";

vi.mock("node:fs");

describe("readSecretOrEnvVar", () => {
  const mockedReadFileSync = vi.fn();
  vi.mocked(fs.readFileSync).mockImplementation(mockedReadFileSync);

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads from filesystem if possible", () => {
    mockedReadFileSync.mockReturnValueOnce("readFromDisk");
    expect(readSecretOrEnvVar("/mock/path", "ENV_VAR", "fallback")).toBe(
      "readFromDisk",
    );
    expect(mockedReadFileSync).toHaveBeenCalledWith("/mock/path", "utf8");
  });

  it("reads from environment variables if file-read fails", () => {
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      throw new Error("File Now Found");
    });
    vi.stubEnv("ENV_VAR", "readFromEnvVar");
    expect(readSecretOrEnvVar("/mock/path", "ENV_VAR", "fallback")).toBe(
      "readFromEnvVar",
    );
  });

  it("reads from environment variables if file-read return undefined", () => {
    mockedReadFileSync.mockReturnValueOnce(undefined);
    vi.stubEnv("ENV_VAR", "readFromEnvVar");
    expect(readSecretOrEnvVar("/mock/path", "ENV_VAR", "fallback")).toBe(
      "readFromEnvVar",
    );
  });

  it("returns fallback if file-read and ENV_VAR fails", () => {
    mockedReadFileSync.mockReturnValueOnce(undefined);
    expect(readSecretOrEnvVar("/mock/path", "ENV_VAR", "fallback")).toBe(
      "fallback",
    );
  });
});
