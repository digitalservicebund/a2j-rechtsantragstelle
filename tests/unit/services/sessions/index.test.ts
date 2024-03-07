import { updateData } from "~/services/session.server/updateData";

describe("updateData simple objects", () => {
  it.each([
    ["empty data with new simple object", {}, { new: "data" }, { new: "data" }],
    [
      "existing data with new unrelated object",
      { old: "data" },
      { new: "data" },
      { old: "data", new: "data" },
    ],
    [
      "existing data with new data on same key",
      { haustier: "cat" },
      { haustier: "dog" },
      { haustier: "dog" },
    ],
    [
      "nested data",
      {
        haustier: "dog",
        kind: { spielzeug: "ball" },
      },
      {
        "kind.spielzeug": "doll",
        "kind.name": "name",
      },
      {
        haustier: "dog",
        kind: { spielzeug: "doll", name: "name" },
      },
    ],
  ])("'%s'", (expl, existingData, newData, expectedData) => {
    const updatedData = updateData(existingData, newData);
    expect(updatedData).toEqual(expectedData);
  });
});

describe("updateData objects with arrays", () => {
  it.each([
    [
      "existing data with new array data",
      { haustier: "dog" },
      {
        "kinder#vorname": "Vorname",
        "kinder#nachname": "Nachname",
      },
      [0],
      {
        haustier: "dog",
        kinder: [{ vorname: "Vorname", nachname: "Nachname" }],
      },
    ],
    [
      "existing data with new array data with later index",
      { haustier: "dog" },
      {
        "kinder#vorname": "Vorname",
        "kinder#nachname": "Nachname",
      },
      [3],
      {
        haustier: "dog",
        kinder: [
          undefined,
          undefined,
          undefined,
          { vorname: "Vorname", nachname: "Nachname" },
        ],
      },
    ],
    [
      "existing array data with new array data",
      {
        haustier: "dog",
        kinder: [{ vorname: "Vorname1", nachname: "Nachname1" }],
      },
      {
        "kinder#vorname": "Vorname2",
        "kinder#nachname": "Nachname2",
      },
      [1],
      {
        haustier: "dog",
        kinder: [
          { vorname: "Vorname1", nachname: "Nachname1" },
          { vorname: "Vorname2", nachname: "Nachname2" },
        ],
      },
    ],
    [
      " existing array data including multiple items with new array data",
      {
        haustier: "dog",
        kinder: [
          { vorname: "Vorname1", nachname: "Nachname1" },
          { vorname: "Vorname2", nachname: "Nachname2" },
        ],
      },
      {
        "kinder#vorname": "Vorname3",
        "kinder#nachname": "Nachname3",
      },
      [2],
      {
        haustier: "dog",
        kinder: [
          { vorname: "Vorname1", nachname: "Nachname1" },
          { vorname: "Vorname2", nachname: "Nachname2" },
          { vorname: "Vorname3", nachname: "Nachname3" },
        ],
      },
    ],
    [
      "updates to existing array item",
      {
        haustier: "dog",
        kinder: [{ vorname: "VornameOld", nachname: "NachnameOld" }],
      },
      {
        "kinder#vorname": "VornameNew",
        "kinder#nachname": "NachnameNew",
      },
      [0],
      {
        haustier: "dog",
        kinder: [{ vorname: "VornameNew", nachname: "NachnameNew" }],
      },
    ],
    [
      "appends to existing array item",
      {
        haustier: "dog",
        kinder: [{ vorname: "Vorname", nachname: "Nachname" }],
      },
      {
        "kinder#wohnort": "Wohnort",
      },
      [0],
      {
        haustier: "dog",
        kinder: [
          { vorname: "Vorname", nachname: "Nachname", wohnort: "Wohnort" },
        ],
      },
    ],
    [
      "mixture of simple and array data",
      {
        haustier: "dog",
        kinder: [{ vorname: "Vorname", nachname: "Nachname" }],
      },
      {
        spielzeug: "ball",
        "kinder#vorname": "VornameNeu",
      },
      [0],
      {
        haustier: "dog",
        spielzeug: "ball",
        kinder: [{ vorname: "VornameNeu", nachname: "Nachname" }],
      },
    ],
    [
      "nested array data",
      {
        haustier: "dog",
        kinder: [{ anwalt: [{ name: "Vorname", nachname: "Nachname" }] }],
      },
      {
        "kinder#anwalt#name": "VornameNeu",
      },
      [0, 0],
      {
        haustier: "dog",
        kinder: [{ anwalt: [{ name: "VornameNeu", nachname: "Nachname" }] }],
      },
    ],
    [
      "nested array data",
      {
        haustier: "dog",
        kinder: [
          {
            anwalt: [
              { name: "Vorname1", nachname: "Nachname1" },
              { name: "Vorname2", nachname: "Nachname2" },
            ],
          },
        ],
      },
      {
        "kinder#anwalt#name": "VornameNeu",
      },
      [0, 1],
      {
        haustier: "dog",
        kinder: [
          {
            anwalt: [
              { name: "Vorname1", nachname: "Nachname1" },
              { name: "VornameNeu", nachname: "Nachname2" },
            ],
          },
        ],
      },
    ],
    [
      "does nothing if no data given but indixes",
      {
        haustier: "dog",
        kinder: [
          {
            anwalt: [
              { name: "Vorname1", nachname: "Nachname1" },
              { name: "Vorname2", nachname: "Nachname2" },
            ],
          },
        ],
      },
      {},
      [0, 1, 2, 3],
      {
        haustier: "dog",
        kinder: [
          {
            anwalt: [
              { name: "Vorname1", nachname: "Nachname1" },
              { name: "Vorname2", nachname: "Nachname2" },
            ],
          },
        ],
      },
    ],
  ])("'%s'", (expl, existingData, newData, arrayIndexes, expectedData) => {
    // @ts-ignore
    const updatedData = updateData(existingData, newData, arrayIndexes);
    expect(updatedData).toEqual(expectedData);
  });
});

describe("updateData error cases", () => {
  it("throws an error if indexes not matching number of hashes", () => {
    const existingData = {
      haustier: "dog",
      kinder: [
        {
          anwalt: [
            { name: "Vorname1", nachname: "Nachname1" },
            { name: "Vorname2", nachname: "Nachname2" },
          ],
        },
      ],
    };
    expect(() =>
      updateData(
        // @ts-ignore
        existingData,
        {
          "kinder#anwalt#name": "VornameNeu",
        },
        [0],
      ),
    ).toThrow();
  });

  it("throws an error if array data given but no indexes", () => {
    const existingData = {
      haustier: "dog",
      kinder: [
        {
          anwalt: [
            { name: "Vorname1", nachname: "Nachname1" },
            { name: "Vorname2", nachname: "Nachname2" },
          ],
        },
      ],
    };
    expect(() =>
      updateData(
        // @ts-ignore
        existingData,
        {
          "kinder#anwalt#name": "VornameNeu",
        },
      ),
    ).toThrow();
  });
});
