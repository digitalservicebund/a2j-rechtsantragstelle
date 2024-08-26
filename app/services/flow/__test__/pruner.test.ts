import { getFormFields } from "../pruner";

vi.mock("~/services/cms/index.server");

describe("pruner", () => {
  describe("getFormFields", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("returns form field names", async () => {
      const stepIds = ["step1", "step2"];

      const result = await getFormFields([{ stepIds }], {
        "/step1": ["field1"],
        "/step2": ["field2"],
      });

      expect(result).toEqual([{ name: "field1" }, { name: "field2" }]);
    });

    it("returns form field names for multiple forms within one flowPage", async () => {
      const result = await getFormFields([{ stepIds: ["step1"] }], {
        "/step1": ["field1", "field2", "field3"],
      });

      expect(result).toEqual([
        { name: "field1" },
        { name: "field2" },
        { name: "field3" },
      ]);
    });

    it("keeps array index", async () => {
      const result = await getFormFields(
        [
          { stepIds: ["step1"] },
          { stepIds: ["step1a", "step2a"], arrayIndex: 0 },
          { stepIds: ["step1b"], arrayIndex: 1 },
        ],
        {
          "/step1": ["field1"],
          "/step1a": ["field1a"],
          "/step2a": ["field2a"],
          "/step1b": ["field1b", "field1b_1"],
        },
      );

      expect(result).toEqual([
        { name: "field1" },
        {
          name: "field1a",
          arrayIndex: 0,
        },
        {
          name: "field2a",
          arrayIndex: 0,
        },
        {
          name: "field1b",
          arrayIndex: 1,
        },
        {
          name: "field1b_1",
          arrayIndex: 1,
        },
      ]);
    });
  });
});
