import { describe, it, expect, vi } from "vitest";
import { deriveCipherKey, pack, unpack } from "../encryption";
import * as logging from "~/services/logging";
import { config } from "~/services/env/env.server";

const mockCipherKey = deriveCipherKey("salt", "key");
const mockData = { foo: "bar", nested: { num: 42 } };

vi.mock("~/services/env/env.server", () => ({ config: vi.fn() }));
const mockedConfig = vi.mocked(config);
mockedConfig.mockReturnValue({ ENABLE_SESSION_ENCRYPTION: true } as any);

describe("deriveCipherKey", () => {
  it("returns key of length 32", () => {
    expect(deriveCipherKey("a", "b")).toHaveLength(32);
  });

  it("returns undefined without key", () => {
    expect(deriveCipherKey("b")).toBeUndefined();
  });
});

describe("pack", () => {
  it("should return a Buffer", () => {
    const result = pack(mockData, mockCipherKey);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("should produce non-JSON buffer with vaultKey", () => {
    const packed = pack(mockData, mockCipherKey);
    const asString = packed.toString("utf8");
    expect(() => JSON.parse(asString)).toThrow("not valid JSON");
  });

  it("should fall back to JSON buffer without vaultKey", () => {
    const result = pack(mockData);
    const parsed = JSON.parse(result.toString("utf8"));
    expect(parsed).toEqual(mockData);
  });

  it("should fall back to JSON buffer if ENABLE_SESSION_ENCRYPTION is false", () => {
    const mockedConfigResponse: any = { ENABLE_SESSION_ENCRYPTION: false };
    mockedConfig.mockReturnValueOnce(mockedConfigResponse);
    const result = pack(mockData, mockCipherKey);
    const parsed = JSON.parse(result.toString("utf8"));
    expect(parsed).toEqual(mockData);
  });
});

describe("unpack", () => {
  it("should decrypt valid encrypted data", () => {
    const encrypted = pack(mockData, mockCipherKey);
    expect(unpack(encrypted, mockCipherKey)).toEqual(mockData);
  });

  it("should parse legacy unencrypted data automatically", () => {
    const legacyData = Buffer.from(JSON.stringify(mockData), "utf8");
    expect(unpack(legacyData, mockCipherKey)).toEqual(mockData);
  });

  it("should return null if the vaultKey is wrong (Auth Tag failure)", () => {
    const encrypted = pack(mockData, mockCipherKey);
    expect(unpack(encrypted, "wrong-key")).toBeNull();
  });

  it("should return undefined and log error if encrypted data is missing a key", () => {
    const logErrorSpy = vi
      .spyOn(logging, "logError")
      .mockImplementation(() => {});
    const encrypted = pack(mockData, mockCipherKey);
    expect(unpack(encrypted)).toBeNull();
    expect(logErrorSpy).toHaveBeenCalledWith({
      error: new Error("Data is encrypted but no key provided."),
    });
    logErrorSpy.mockRestore();
  });

  it("should return null if the buffer is tampered with", () => {
    const encrypted = pack(mockData, mockCipherKey);
    encrypted[encrypted.length - 1] ^= 1; // Flip a random bit in the ciphertext area
    expect(unpack(encrypted, mockCipherKey)).toBeNull();
  });

  it("should return null for an empty buffer", () => {
    expect(unpack(Buffer.alloc(0), mockCipherKey)).toBeNull();
  });

  it("should return null for non-JSON data", () => {
    const badData = Buffer.from("this is definitely not json", "utf8");
    expect(unpack(badData, mockCipherKey)).toBeNull();
  });

  it("should return null if the encrypted buffer is truncated", () => {
    const encrypted = pack(mockData, mockCipherKey);
    const truncated = encrypted.subarray(0, 10);
    expect(unpack(truncated, mockCipherKey)).toBeNull();
  });

  it("should handle an empty object correctly", () => {
    const empty = {};
    const packed = pack(empty, mockCipherKey);
    expect(unpack(packed, mockCipherKey)).toEqual(empty);
  });
});

describe("Rotation Simulation", () => {
  it("should produce different ciphertexts for the same data (IV rotation)", () => {
    const blob1 = pack(mockData, mockCipherKey);
    const blob2 = pack(mockData, mockCipherKey);
    expect(blob1.equals(blob2)).toBe(false);
  });
});
