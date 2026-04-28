import z from "zod";
import { processSpecialFieldDisplay } from "~/services/processSpecialFieldDisplay";
import { ibanZodDescription } from "~/services/validation/iban";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";

describe("processSpecialFieldDisplay", () => {
  it("should call the encode method of a special field schema if present", () => {
    const mockEncode = vi.fn((str) => str + " encoded");
    const specialFieldSchema = schemaOrEmptyString(
      z
        .codec(z.string(), z.string(), {
          encode: mockEncode,
          decode: vi.fn(),
        })
        .describe(ibanZodDescription),
    );
    const result = processSpecialFieldDisplay("test", specialFieldSchema);
    expect(mockEncode).toHaveBeenCalled();
    expect(result).toBe("test encoded");
  });

  it("should return the unmodified value if the schema isn't a special field", () => {
    const result = processSpecialFieldDisplay("unmodified", z.string());
    expect(result).toBe("unmodified");
  });
});
