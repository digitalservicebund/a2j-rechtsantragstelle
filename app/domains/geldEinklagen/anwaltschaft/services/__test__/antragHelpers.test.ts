import { createSession } from "react-router";
import {
  deleteAntrag,
  getAllConnectedVortraegeIndices,
  getAntragIndex,
} from "../antragHelpers";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";

const sonstigerAntrag = { id: "sonstig", antrag: "Mein Antrag" };
const hauptantrag = {
  id: "haupt",
  betragForderung: "100",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "" },
  zinsende: { day: "", month: "" },
  nebenantraege: [
    {
      id: "neben",
      type: "annahmeverzug",
      annahmeverzugsFeststellung: "on",
      annahmeverzugDatum: { day: "", month: "" },
    },
  ],
} satisfies NonNullable<
  GeldEinklagenAnwaltschaftUserData["hauptantrag"]
>[number];

const userData = {
  hauptantrag: [hauptantrag],
  sonstigeAntraege: [{ antrag: "Entwurf" }, sonstigerAntrag],
  vortraege: [
    { antragId: "haupt" },
    { antragId: "sonstig" },
    { antragId: "neben" },
    { antragId: "haupt" },
  ],
};

describe("getAntragIndex", () => {
  it("finds the ID in the specified array and skips drafts without an ID", () => {
    expect(getAntragIndex(sonstigerAntrag, userData, "sonstigeAntraege")).toBe(
      1,
    );
    expect(getAntragIndex(sonstigerAntrag, userData, "hauptantrag")).toBe(-1);
    expect(
      getAntragIndex({ antrag: "Entwurf" }, userData, "sonstigeAntraege"),
    ).toBe(-1);
  });
});

describe("getAllConnectedVortraegeIndices", () => {
  it("returns all direct and Nebenantrag matches in session order", () => {
    expect(getAllConnectedVortraegeIndices(hauptantrag, userData)).toEqual([
      0, 2, 3,
    ]);
    expect(getAllConnectedVortraegeIndices(sonstigerAntrag, userData)).toEqual([
      1,
    ]);
    expect(getAllConnectedVortraegeIndices(hauptantrag, {})).toEqual([]);
  });
});

describe("deleteAntrag", () => {
  it("deletes the Antrag and its direct and Nebenantrag Vorträge without shifting unrelated items out", async () => {
    const session = createSession(userData);

    const response = deleteAntrag(session, hauptantrag, "hauptantrag");

    expect(response.status).toBe(200);
    expect(session.data.hauptantrag).toEqual([]);
    expect(session.data.sonstigeAntraege).toEqual(userData.sonstigeAntraege);
    expect(session.data.vortraege).toEqual([{ antragId: "sonstig" }]);
  });

  it("does not delete Vorträge when the Antrag is absent from the requested array", async () => {
    const session = createSession(userData);

    const response = deleteAntrag(session, hauptantrag, "sonstigeAntraege");

    expect(response.status).toBe(422);
    expect(await response.text()).toBe("Antrag not found or missing ID.");
    expect(session.data).toEqual(userData);
  });
});
