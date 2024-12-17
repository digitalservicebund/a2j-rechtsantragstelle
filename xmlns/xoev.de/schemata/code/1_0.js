var cxml = require("@wikipathways/cxml");
var Primitive = require("../../../xml-primitives");

cxml.register(
  "http://xoev.de/schemata/code/1_0",
  exports,
  [[Primitive, ["string"], []]],
  ["Code"],
  [
    [0, 0, [], []],
    [
      0,
      0,
      [
        [1, 0],
        [4, 1],
      ],
      [
        [2, 1],
        [3, 1],
      ],
    ],
  ],
  [
    ["code", [1], 0],
    ["listURI", [1], 0],
    ["listVersionID", [1], 0],
    ["name", [1], 0],
  ],
);
