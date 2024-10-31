import * as logging from "~/services/logging";
import { getTranslationByKey } from "../getTranslationByKey";

describe("getTranslationByKey", () => {
  it("returns existing translations", () => {
    expect(getTranslationByKey("key", { key: "value" })).toEqual("value");
  });

  describe("handles failed lookups", () => {
    test.each([
      ["key", {}],
      ["key", undefined],
    ])("key: '%s', translations: %o", (key, translations) => {
      const logSpy = vi.spyOn(logging, "sendSentryMessage");
      const actual = getTranslationByKey(key, translations);
      expect(actual).toEqual(key);

      expect(logSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        `Key translation ${key} is not available in the translation record. Please take a look in the CMS system!`,
        "warning",
      );
      logSpy.mockRestore();
    });
  });
});
