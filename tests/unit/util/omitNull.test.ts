import { omitNull } from "~/util/omitNull";

describe("util/omitNull", () => {
  it("removes entries where the value is null", () => {
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
        i: undefined,
        j: [],
        k: {},
        l: 0,
      },
    };
    expect(omitNull(data)).toMatchInlineSnapshot(`
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
          "i": undefined,
          "j": [],
          "k": {},
          "l": 0,
        },
      }
    `);
  });
});
