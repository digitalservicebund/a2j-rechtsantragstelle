import {
  fillTemplate,
  interpolateSerializableObject,
  throwIfFunction,
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

  describe("interpolateSerializableObject", () => {
    it("should replace the template strings in a string with the given replacements", () => {
      const string = "{{replaceMe}}";
      expect(
        interpolateSerializableObject(string, { replaceMe: "New String!" }),
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
      const interpolatedObj = interpolateSerializableObject(inputObj, {
        replaceMe: "New String!",
      });
      expect(interpolatedObj.prop2.prop3.prop4).toBe("New String!");
    });

    it("should replace the template strings in an object with the given replacements", () => {
      const inputObj = {
        prop1: "bar",
        prop2: "{{replaceMe}}",
      };
      const interpolatedObj = interpolateSerializableObject(inputObj, {
        replaceMe: "New String!",
      });
      expect(interpolatedObj.prop2).toBe("New String!");
    });

    it("should disregard whitespace found inside template strings", () => {
      const string = "{{ replaceMe  }}";
      const interpolatedString = interpolateSerializableObject(string, {
        replaceMe: "New String!",
      });
      expect(interpolatedString).not.toEqual(" New String!  ");
      expect(interpolatedString).toEqual("New String!");
    });

    it("should throw an error if there is an unclosed placeholder", () => {
      const stringWithoutEnd = "{{replaceMe";
      expect(() => {
        interpolateSerializableObject(stringWithoutEnd, {
          replaceMe: "New String!",
        });
      }).toThrow();
    });

    it("should ignore incorrectly formatte placeholders", () => {
      const stringWithoutBeginning = "replaceMe}}";
      expect(
        interpolateSerializableObject(stringWithoutBeginning, {
          replaceMe: "New String!",
        }),
      ).toEqual(stringWithoutBeginning);

      const stringIncorrectNumBrackets = "{replaceMe}";
      expect(
        interpolateSerializableObject(stringIncorrectNumBrackets, {
          replaceMe: "New String!",
        }),
      ).toEqual(stringIncorrectNumBrackets);
    });

    it("should throw an error if the user tries to serialize a function", () => {
      expect(() => interpolateSerializableObject(vi.fn(), {})).toThrow();
    });
  });

  describe("throwIfFunction", () => {
    it("should throw an error if the value is a function", () => {
      expect(() => throwIfFunction("key", vi.fn())).toThrow();
    });
  });
});
