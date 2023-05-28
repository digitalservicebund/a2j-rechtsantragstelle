import { removeEmpty } from "~/util/removeEmpty";

describe("removeEmpty", () => {
  it("removes nulls", () => {
    const data = {
      a: {
        b: 1,
        c: null,
        d: [
          {
            e: 2,
            f: null,
          },
          {
            g: 3,
            h: null,
          },
          null,
        ],
      },
    };
    expect(removeEmpty(data)).toMatchInlineSnapshot(`
      {
        "a": {
          "b": 1,
          "d": [
            {
              "e": 2,
            },
            {
              "g": 3,
            },
          ],
        },
      }
    `);
  });
});
