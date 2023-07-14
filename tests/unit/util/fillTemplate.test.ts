import { fillTemplate } from "~/util/fillTemplate";

describe("fillTemplate", () => {
  describe("without matches", () => {
    it("should return template without replacements given", () => {
      const template = "foobar";
      expect(fillTemplate({ template })).toEqual(template);
    });

    it("should return template with not-matching replacments given", () => {
      const template = "foobar";
      expect(fillTemplate({ template, replacements: { bla: "blub" } })).toEqual(
        template,
      );
    });
  });

  describe("with matches", () => {
    it("should return template", () => {
      const template = "foobar {{baz}} lala";
      expect(fillTemplate({ template, replacements: { baz: "buzz" } })).toEqual(
        "foobar buzz lala",
      );
    });
  });
});
