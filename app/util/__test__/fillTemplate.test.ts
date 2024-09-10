import {
  fillTemplate,
  hasFunction,
  interpolateDeep,
  interpolateFlowDeep,
} from "~/util/fillTemplate";

describe("template utilities", () => {
  describe("fillTemplate", () => {
    describe("without matches", () => {
      it("should return template without replacements given", () => {
        const template = "foobar";
        expect(fillTemplate({ template })).toEqual(template);
      });

      it("should return template with not-matching replacments given", () => {
        const template = "foobar";
        expect(
          fillTemplate({ template, replacements: { bla: "blub" } }),
        ).toEqual(template);
      });
    });

    describe("with matches", () => {
      it("should return template", () => {
        const template = "foobar {{baz}} lala";
        expect(
          fillTemplate({ template, replacements: { baz: "buzz" } }),
        ).toEqual("foobar buzz lala");
      });
    });
  });

  describe("interpolateDeep", () => {
    it("should replace the template strings in a string with the given replacements", () => {
      const string = "{{replaceMe}}";
      expect(interpolateDeep(string, { replaceMe: "New String!" })).toEqual(
        "New String!",
      );
    });

    it("should replace the template strings in an object with the given replacements", () => {
      const inputObj = {
        prop1: "bar",
        prop2: "{{replaceMe}}",
      };
      const interpolatedObj = interpolateDeep(inputObj, {
        replaceMe: "New String!",
      });
      expect(interpolatedObj.prop2).toBe("New String!");
    });

    it("should disregard whitespace found inside template strings", () => {
      const string = "{{ replaceMe  }}";
      const interpolatedString = interpolateDeep(string, {
        replaceMe: "New String!",
      });
      expect(interpolatedString).not.toEqual(" New String!  ");
      expect(interpolatedString).toEqual("New String!");
    });

    it("should throw an error if there is an unclosed placeholder", () => {
      const stringWithoutEnd = "{{replaceMe";
      expect(() => {
        interpolateDeep(stringWithoutEnd, {
          replaceMe: "New String!",
        });
      }).toThrow();
    });

    it("should ignore incorrectly formatte placeholders", () => {
      const stringWithoutBeginning = "replaceMe}}";
      expect(
        interpolateDeep(stringWithoutBeginning, {
          replaceMe: "New String!",
        }),
      ).toEqual(stringWithoutBeginning);

      const stringIncorrectNumBrackets = "{replaceMe}";
      expect(
        interpolateDeep(stringIncorrectNumBrackets, {
          replaceMe: "New String!",
        }),
      ).toEqual(stringIncorrectNumBrackets);
    });
  });

  describe("interpolateTemplateDeep", () => {
    it("should replace the template strings in a flow with the given replacements", () => {
      const flow = {
        prop1: "bar",
        prop2: {
          prop2Child: "{{replaceMe}}",
        },
      };
      const interpolatedFlow = interpolateFlowDeep(flow, {
        replaceMe: "New String!",
      });
      expect(interpolatedFlow.prop2.prop2Child).toBe("New String!");
    });

    it("should throw an error if the flow contains a nested function", () => {
      const flow = {
        prop1: "bar",
        prop2: {
          prop2Child: "{{replaceMe}}",
        },
        prop3: {
          uhOh: vi.fn(),
        },
      };
      expect(() => {
        interpolateFlowDeep(flow, {
          replaceMe: "New String!",
        });
      }).toThrow();
    });
  });

  describe("hasFunction", () => {
    it("should return true if the object contains a function", () => {
      const obj = {
        prop1: "bar",
        prop2: {
          prop2Child: "foo",
        },
        prop3: {
          uhOh: vi.fn(),
        },
      };
      expect(hasFunction(obj)).toBe(true);
    });

    it("should return false if the object does not contain a function", () => {
      const obj = {
        prop1: "bar",
        prop2: {
          prop2Child: "foo",
        },
      };
      expect(hasFunction(obj)).toBe(false);
    });
  });
});
