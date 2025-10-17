import * as logging from "~/services/logging";
import { applyStringReplacement } from "~/util/applyStringReplacement";

describe("applyStringReplacement", () => {
  it("should replace the template strings in a string with the given replacements", () => {
    const string = "{{replaceMe}}";
    expect(
      applyStringReplacement(string, { replaceMe: "New String!" }),
    ).toEqual("New String!");
  });

  it("should interpolate deeply into nested objects", () => {
    const inputObj = {
      prop1: "bar",
      prop2: {
        prop3: {
          prop4: "{{replaceMe}}",
        },
      },
    };
    const interpolatedObj = applyStringReplacement(inputObj, {
      replaceMe: "New String!",
    });
    expect(interpolatedObj.prop2.prop3.prop4).toBe("New String!");
  });

  describe("should remove objects with an isVisible value that evaluates to false", () => {
    it("should remove flat objects", () => {
      const inputObj = {
        isVisible: "hasArbeit",
      };
      expect(applyStringReplacement(inputObj, { hasArbeit: false })).toEqual(
        undefined,
      );
    });

    it("should remove objects inside of arrays", () => {
      const inputObj = {
        arr: [{}, { isVisible: "hasArbeit" }, { isVisible: "hasBuergergeld" }],
      };
      expect(applyStringReplacement(inputObj, { hasArbeit: false })).toEqual({
        ...inputObj,
        arr: [{}, { isVisible: "hasBuergergeld" }],
      });
    });
    it("should remove deeply nested objects", () => {
      const inputObj = {
        nested: {
          isVisible: "hasArbeit",
        },
        key: "value",
      };
      expect(applyStringReplacement(inputObj, { hasArbeit: false })).toEqual({
        key: "value",
      });
    });
  });

  it("should replace the template strings in an object with the given replacements", () => {
    const inputObj = {
      prop1: "bar",
      prop2: "{{replaceMe}}",
    };
    const interpolatedObj = applyStringReplacement(inputObj, {
      replaceMe: "New String!",
    });
    expect(interpolatedObj.prop2).toBe("New String!");
  });

  it("should disregard whitespace found inside template strings", () => {
    const string = "{{ replaceMe  }}";
    const interpolatedString = applyStringReplacement(string, {
      replaceMe: "New String!",
    });
    expect(interpolatedString).not.toEqual(" New String!  ");
    expect(interpolatedString).toEqual("New String!");
  });

  it("should log an error and return the original content if there is a syntax error in the template string", () => {
    const logErrorSpy = vi.spyOn(logging, "logError");
    const templateStringWithoutClosingBrackets = "{{replaceMe";
    expect(
      applyStringReplacement(templateStringWithoutClosingBrackets, {
        replaceMe: "New String!",
      }),
    ).toEqual(templateStringWithoutClosingBrackets);
    expect(logErrorSpy).toHaveBeenCalledOnce();
    logErrorSpy.mockRestore();
  });

  it("should ignore incorrectly formatte placeholders", () => {
    const stringWithoutBeginning = "replaceMe}}";
    expect(
      applyStringReplacement(stringWithoutBeginning, {
        replaceMe: "New String!",
      }),
    ).toEqual(stringWithoutBeginning);

    const stringIncorrectNumBrackets = "{replaceMe}";
    expect(
      applyStringReplacement(stringIncorrectNumBrackets, {
        replaceMe: "New String!",
      }),
    ).toEqual(stringIncorrectNumBrackets);
  });

  it("should not replace the indexArray placeholder if skipIndexArrayReplacement is true", () => {
    const content = "some text {{indexArray}}";
    const actual = applyStringReplacement(content, { indexArray: "1" }, true);
    expect(actual).toEqual(content);
  });

  it("should replace the indexArray placeholder if skipIndexArrayReplacement is false", () => {
    const content = "some text {{indexArray}}";
    const actual = applyStringReplacement(content, { indexArray: "1" }, false);
    expect(actual).toEqual("some text 1");
  });

  it("should return the content unchanged if the value is boolean after the interpolation", () => {
    const testBooleanValue = { anotherValue: true, someValue: "{{replaceMe}}" };

    const actual = applyStringReplacement(testBooleanValue, {
      replaceMe: "New String!",
    });

    expect(actual.anotherValue).toBe(true);
  });
});
