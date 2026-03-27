import { describe, it, expect, vi } from "vitest";
import { pack, unpack } from "../encryption";
import * as logging from "~/services/logging";
import { config } from "~/services/env/env.server";

const mockUuid = "session-123-abc";
const mockVaultKey = "super-secret-vault-key";
const mockData = { foo: "bar", nested: { num: 42 } };

vi.mock("~/services/env/env.server", () => ({ config: vi.fn() }));
const mockedConfig = vi.mocked(config);
mockedConfig.mockReturnValue({ ENABLE_SESSION_ENCRYPTION: true } as any);

describe("pack", () => {
  it("should return a Buffer", () => {
    const result = pack(mockData, mockUuid);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("should produce non-JSON buffer with vaultKey", () => {
    const packed = pack(mockData, mockUuid, mockVaultKey);
    const asString = packed.toString("utf8");
    expect(() => JSON.parse(asString)).toThrow("not valid JSON");
  });

  it("should fall back to JSON buffer without vaultKey", () => {
    const result = pack(mockData, mockUuid);
    const parsed = JSON.parse(result.toString("utf8"));
    expect(parsed).toEqual(mockData);
  });

  it("should fall back to JSON buffer if ENABLE_SESSION_ENCRYPTION is false", () => {
    const mockedConfigResponse: any = { ENABLE_SESSION_ENCRYPTION: false };
    mockedConfig.mockReturnValueOnce(mockedConfigResponse);
    const result = pack(mockData, mockUuid, mockVaultKey);
    const parsed = JSON.parse(result.toString("utf8"));
    expect(parsed).toEqual(mockData);
  });
});

describe("unpack", () => {
  it("should decrypt valid encrypted data", () => {
    const encrypted = pack(mockData, mockUuid, mockVaultKey);
    expect(unpack(encrypted, mockUuid, mockVaultKey)).toEqual(mockData);
  });

  it("should parse legacy unencrypted data automatically", () => {
    const legacyData = Buffer.from(JSON.stringify(mockData), "utf8");
    expect(unpack(legacyData, mockUuid)).toEqual(mockData);
  });

  it("should return null if the vaultKey is wrong (Auth Tag failure)", () => {
    const encrypted = pack(mockData, mockUuid, mockVaultKey);
    expect(unpack(encrypted, mockUuid, "wrong-key")).toBeNull();
  });

  it("should return null if the UUID is different (Key Derivation failure)", () => {
    const encrypted = pack(mockData, "uuid-a", mockVaultKey);
    expect(unpack(encrypted, "uuid-b", mockVaultKey)).toBeNull();
  });

  it("should return undefined and log error if encrypted data is missing a key", () => {
    const logErrorSpy = vi
      .spyOn(logging, "logError")
      .mockImplementation(() => {});
    const encrypted = pack(mockData, mockUuid, mockVaultKey);
    expect(unpack(encrypted, mockUuid)).toBeNull();
    expect(logErrorSpy).toHaveBeenCalledWith({
      error: new Error("Data is encrypted but no key provided."),
    });
    logErrorSpy.mockRestore();
  });

  it("should return null if the buffer is tampered with", () => {
    const encrypted = pack(mockData, mockUuid, mockVaultKey);
    encrypted[encrypted.length - 1] ^= 1; // Flip a random bit in the ciphertext area
    expect(unpack(encrypted, mockUuid, mockVaultKey)).toBeNull();
  });

  it("should return null for an empty buffer", () => {
    expect(unpack(Buffer.alloc(0), mockUuid)).toBeNull();
  });

  it("should return null for non-JSON data", () => {
    const badData = Buffer.from("this is definitely not json", "utf8");
    expect(unpack(badData, mockUuid)).toBeNull();
  });

  it("should return null if the encrypted buffer is truncated", () => {
    const encrypted = pack(mockData, mockUuid, mockVaultKey);
    const truncated = encrypted.subarray(0, 10);
    expect(unpack(truncated, mockUuid, mockVaultKey)).toBeNull();
  });

  it("should handle an empty object correctly", () => {
    const empty = {};
    const packed = pack(empty, mockUuid, mockVaultKey);
    expect(unpack(packed, mockUuid, mockVaultKey)).toEqual(empty);
  });
});

describe("Rotation Simulation", () => {
  it("should support a sequential rotation flow", () => {
    const keyA = "keyA";
    const keyB = "keyB";

    const blob1 = pack(mockData, mockUuid, keyA);
    const current = unpack(blob1, mockUuid, keyA);
    expect(current).toEqual(mockData);

    const updatedData = { ...current, page: 2 };
    const blob2 = pack(updatedData, mockUuid, keyB);
    expect(unpack(blob2, mockUuid, keyA)).toBeNull(); // Verify Key A no longer works for blob2
    expect(unpack(blob2, mockUuid, keyB)).toEqual(updatedData); // Verify Key B works for blob2
  });

  it("should produce different ciphertexts for the same data (IV rotation)", () => {
    const blob1 = pack(mockData, mockUuid, mockVaultKey);
    const blob2 = pack(mockData, mockUuid, mockVaultKey);
    expect(blob1.equals(blob2)).toBe(false);
  });
});
