import { omitNull } from "~/util/omitNull";

describe("util/omitNull", () => {
  const cases = [
    {
      input: { a: { b: null, c: 1 } },
      output: { a: { b: undefined, c: 1 } },
    },
    {
      input: { d: undefined, e: [null, { f: null }] },
      output: { d: undefined, e: [undefined, { f: undefined }] },
    },
    {
      input: [],
      output: [],
    },
    {
      input: [null, null],
      output: [undefined, undefined],
    },
    {
      input: [null, undefined, { x: false, y: "", z: 0 }],
      output: [undefined, undefined, { x: false, y: "", z: 0 }],
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
          c: undefined,
          d: [
            {
              e: 2,
              f: undefined,
            },
            {
              g: 3,
              h: undefined,
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
