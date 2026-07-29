import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbscheinAnfrageFlowConfig } from "~/domains/nachlass/erbschein/anfrage/flowConfig";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  datenverarbeitungZustimmung: "on",
  verstorbenePersonStrasse: "Musterstraße",
  verstorbenePersonHausnummer: "1",
  verstorbenePersonOrt: "Musterstadt",
  antragstellendePersonRelationshipToErblasser: "cousin",
  testamentArt: "none",
  verstorbeneFamilienstand: "ledig",
};

type UserData = Parameters<typeof createFlowSession>[1];

describe("angehoerigeOverview Back navigation", () => {
  it("goes to the step before the array after one deceased Angehoerige was filled in", () => {
    const session = createFlowSession(
      nachlassErbscheinAnfrageFlowConfig,
      {
        ...happyPathData,
        angehoerige: [
          {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: { day: "01", month: "01", year: "1990" },
            geburtsort: "Musterstadt",
            isAlive: "no",
            sterbedatum: { day: "01", month: "01", year: "2020" },
            sterbeort: "Musterstadt",
          },
        ],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/angehoerige/uebersicht",
    );

    expect(session.prevPath).toBe("/testament-oder-erbvertrag/art");
  });

  it("does not leak an unresolved array wildcard when no Angehoerige was ever submitted", () => {
    const session = createFlowSession(
      nachlassErbscheinAnfrageFlowConfig,
      {
        ...happyPathData,
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/angehoerige/uebersicht",
    );

    expect(session.prevPath).not.toContain("#");
  });
});
