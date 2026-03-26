import { describe, it, expect, vi } from "vitest";
import { pack, unpack } from "../encryption";

const mockUuid = "session-123-abc";
const mockUserKey = "super-secret-user-key";
const mockData = { foo: "bar", nested: { num: 42 } };

describe("pack", () => {
  it("should return a Buffer", () => {
    const result = pack(mockData, mockUuid);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("should produce non-JSON buffer with userKey", () => {
    const packed = pack(mockData, mockUuid, mockUserKey);
    const asString = packed.toString("utf8");
    expect(() => JSON.parse(asString)).toThrow("not valid JSON");
  });

  it("should fall back to JSON buffer without userKey", () => {
    const result = pack(mockData, mockUuid);
    const parsed = JSON.parse(result.toString("utf8"));
    expect(parsed).toEqual(mockData);
  });
});

describe("unpack", () => {
  it("should decrypt valid encrypted data", () => {
    const encrypted = pack(mockData, mockUuid, mockUserKey);
    expect(unpack(encrypted, mockUuid, mockUserKey)).toEqual(mockData);
  });

  it("should parse legacy unencrypted data automatically", () => {
    const legacyData = Buffer.from(JSON.stringify(mockData), "utf8");
    expect(unpack(legacyData, mockUuid)).toEqual(mockData);
  });

  it("should return null if the userKey is wrong (Auth Tag failure)", () => {
    const encrypted = pack(mockData, mockUuid, mockUserKey);
    expect(unpack(encrypted, mockUuid, "wrong-key")).toBeNull();
  });

  it("should return null if the UUID is different (Key Derivation failure)", () => {
    const encrypted = pack(mockData, "uuid-a", mockUserKey);
    expect(unpack(encrypted, "uuid-b", mockUserKey)).toBeNull();
  });

  it("should return null and log error if encrypted data is missing a key", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const encrypted = pack(mockData, mockUuid, mockUserKey);
    expect(unpack(encrypted, mockUuid)).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Vault] Unpack failed:",
      "Data is encrypted but no key provided.",
    );
    consoleSpy.mockRestore();
  });

  it("should return null if the buffer is tampered with", () => {
    const encrypted = pack(mockData, mockUuid, mockUserKey);
    encrypted[encrypted.length - 1] ^= 1; // Flip a random bit in the ciphertext area
    expect(unpack(encrypted, mockUuid, mockUserKey)).toBeNull();
  });

  it("should return null for an empty buffer", () => {
    expect(unpack(Buffer.alloc(0), mockUuid)).toBeNull();
  });

  it("should return null for non-JSON data", () => {
    const badData = Buffer.from("this is definitely not json", "utf8");
    expect(unpack(badData, mockUuid)).toBeNull();
  });

  it("should return null if the encrypted buffer is truncated", () => {
    const encrypted = pack(mockData, mockUuid, mockUserKey);
    const truncated = encrypted.subarray(0, 10);
    expect(unpack(truncated, mockUuid, mockUserKey)).toBeNull();
  });

  it("should handle an empty object correctly", () => {
    const empty = {};
    const packed = pack(empty, mockUuid, mockUserKey);
    expect(unpack(packed, mockUuid, mockUserKey)).toEqual(empty);
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
    const blob1 = pack(mockData, mockUuid, mockUserKey);
    const blob2 = pack(mockData, mockUuid, mockUserKey);
    expect(blob1.equals(blob2)).toBe(false);
  });
});
