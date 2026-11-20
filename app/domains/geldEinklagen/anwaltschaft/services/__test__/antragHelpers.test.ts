import { createSession } from "react-router";
import {
  deleteAntrag,
  getAllConnectedVortraegeIndices,
  getAntragDeletionDialogProps,
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

const warningTexts = {
  auswirkungenText: "Auswirkungen",
  keepAndEditText: "Bearbeiten",
  deletePermanentlyText: "Löschen",
};

// A Vortrag only counts as connected once it has content besides its antragId
const vortrag = (antragId: string) => ({
  antragId,
  absaetze: [{ formulierung: "Sachverhalt" }],
});

const userData = {
  hauptantrag: [hauptantrag],
  sonstigeAntraege: [{ antrag: "Entwurf" }, sonstigerAntrag],
  vortraege: [
    vortrag("haupt"),
    vortrag("sonstig"),
    vortrag("neben"),
    vortrag("haupt"),
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

  it("ignores Vorträge that only have an antragId unless includeEmpty is set", () => {
    const emptyVortraege = {
      vortraege: [{ antragId: "haupt" }, { antragId: "neben" }],
    };
    expect(
      getAllConnectedVortraegeIndices(hauptantrag, emptyVortraege),
    ).toEqual([]);
    expect(
      getAllConnectedVortraegeIndices(hauptantrag, emptyVortraege, true),
    ).toEqual([0, 1]);
  });
});

describe("deleteAntrag", () => {
  it("deletes the Antrag and its direct and Nebenantrag Vorträge without shifting unrelated items out", async () => {
    const session = createSession(userData);

    const response = deleteAntrag(session, hauptantrag, "hauptantrag");

    expect(response.status).toBe(200);
    expect(session.data.hauptantrag).toEqual([]);
    expect(session.data.sonstigeAntraege).toEqual(userData.sonstigeAntraege);
    expect(session.data.vortraege).toEqual([vortrag("sonstig")]);
  });

  it("also deletes empty Vorträge of the Antrag so none are orphaned", () => {
    const session = createSession({
      ...userData,
      vortraege: [
        { antragId: "haupt" },
        vortrag("sonstig"),
        { antragId: "neben" },
      ],
    });

    const response = deleteAntrag(session, hauptantrag, "hauptantrag");

    expect(response.status).toBe(200);
    expect(session.data.vortraege).toEqual([vortrag("sonstig")]);
  });

  it("does not delete Vorträge when the Antrag is absent from the requested array", async () => {
    const session = createSession(userData);

    const response = deleteAntrag(session, hauptantrag, "sonstigeAntraege");

    expect(response.status).toBe(422);
    expect(await response.text()).toBe("Antrag not found or missing ID.");
    expect(session.data).toEqual(userData);
  });
});

describe("getAntragDeletionDialogProps", () => {
  it("includes the warning when the Antrag has connected Vorträge", () => {
    const props = getAntragDeletionDialogProps({
      antrag: sonstigerAntrag,
      userData: { vortraege: [vortrag("sonstig")] },
      itemLabel: "Antrag 1",
      warningTexts,
    });

    expect(props.itemLabel).toBe("Antrag 1");
    expect(props.warning).toMatchObject(warningTexts);
  });

  it("omits the warning when the Antrag has no connected Vorträge", () => {
    const props = getAntragDeletionDialogProps({
      antrag: sonstigerAntrag,
      userData: { vortraege: [vortrag("other")] },
      itemLabel: "Antrag 1",
      warningTexts,
    });

    expect(props.warning).toBeUndefined();
  });
});
