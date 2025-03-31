import { recursivelyReplaceStrings } from "~/util/recursivelyReplaceStrings";

describe("recursivelyReplaceStrings", () => {
  it("should replace the template strings in a string with the given replacements", () => {
    const string = "{{replaceMe}}";
    expect(
      recursivelyReplaceStrings(string, { replaceMe: "New String!" }),
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
    const interpolatedObj = recursivelyReplaceStrings(inputObj, {
      replaceMe: "New String!",
    });
    expect(interpolatedObj.prop2.prop3.prop4).toBe("New String!");
  });

  it("should replace the template strings in an object with the given replacements", () => {
    const inputObj = {
      prop1: "bar",
      prop2: "{{replaceMe}}",
    };
    const interpolatedObj = recursivelyReplaceStrings(inputObj, {
      replaceMe: "New String!",
    });
    expect(interpolatedObj.prop2).toBe("New String!");
  });

  it("should disregard whitespace found inside template strings", () => {
    const string = "{{ replaceMe  }}";
    const interpolatedString = recursivelyReplaceStrings(string, {
      replaceMe: "New String!",
    });
    expect(interpolatedString).not.toEqual(" New String!  ");
    expect(interpolatedString).toEqual("New String!");
  });

  it("should throw an error if there is an unclosed placeholder", () => {
    const stringWithoutEnd = "{{replaceMe";
    expect(() => {
      recursivelyReplaceStrings(stringWithoutEnd, {
        replaceMe: "New String!",
      });
    }).toThrow();
  });

  it("should ignore incorrectly formatte placeholders", () => {
    const stringWithoutBeginning = "replaceMe}}";
    expect(
      recursivelyReplaceStrings(stringWithoutBeginning, {
        replaceMe: "New String!",
      }),
    ).toEqual(stringWithoutBeginning);

    const stringIncorrectNumBrackets = "{replaceMe}";
    expect(
      recursivelyReplaceStrings(stringIncorrectNumBrackets, {
        replaceMe: "New String!",
      }),
    ).toEqual(stringIncorrectNumBrackets);
  });
});
