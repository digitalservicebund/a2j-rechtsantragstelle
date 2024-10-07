import * as logging from "~/services/logging";
import { getTranslationByKey } from "../getTranslationByKey";

const TRANSLATION_KEY_RECORD = {
  key: "translation key",
};

describe("getTranslationByKey", () => {
  it("should return the translation by the key correct", () => {
    const mockKeyValue = "key";
    const actual = getTranslationByKey(mockKeyValue, TRANSLATION_KEY_RECORD);

    expect(actual).toEqual(TRANSLATION_KEY_RECORD[mockKeyValue]);
  });

  it("in case the key does not exist in the translation record, it should call sendSentryMessage and return the key", () => {
    const mockKeyValue = "not_existing_key";
    const logSpy = vi.spyOn(logging, "sendSentryMessage");
    const actual = getTranslationByKey(mockKeyValue, TRANSLATION_KEY_RECORD);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      `Key translation ${mockKeyValue} is not available in the translation record. Please take a look in the CMS system!`,
      "warning",
    );
    expect(actual).toEqual(mockKeyValue);

    logSpy.mockRestore();
  });
});
