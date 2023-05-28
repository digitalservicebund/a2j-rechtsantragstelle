import { omitNull } from "~/util/omitNull";

describe("util/omitNull", () => {
  const cases = [
    {
      input: { a: { b: null, c: 1 } },
      output: { a: { c: 1 } },
    },
    {
      input: { d: undefined, e: [null, { f: null }] },
      output: { d: undefined, e: [{}] },
    },
    {
      input: [],
      output: [],
    },
    {
      input: [null, null],
      output: [],
    },
    {
      input: [null, undefined, { x: false, y: "", z: 0 }],
      output: [undefined, { x: false, y: "", z: 0 }],
    },
    {
      input: null,
      output: undefined,
    },
    {
      input: undefined,
      output: undefined,
    },
    {
      input: {
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
      },
      output: {
        a: {
          b: 1,
          d: [
            {
              e: 2,
            },
            {
              g: 3,
            },
          ],
          i: undefined,
          j: [],
          k: {},
          l: 0,
        },
      },
    },
  ];

  test.each(cases)("given $input, returns $output", ({ input, output }) => {
    expect(omitNull(input)).toEqual(output);
  });
});
