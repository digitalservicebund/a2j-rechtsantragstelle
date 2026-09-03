import { createSession } from "react-router";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { copyAntragstellendePersonData } from "~/domains/nachlass/services/copyAntragstellendePersonData";

const mockAntragstellendePersonData: NachlassErbscheinAnfrageUserData = {
  antragstellendePersonVorname: "John",
  antragstellendePersonNachname: "Doe",
  antragstellendePersonGeburtsdatum: {
    day: "1",
    month: "1",
    year: "1990",
  },
  antragstellendePersonStaatsangehoerigkeit: "DE",
  antragstellendePersonHasSecondNationality: "no",
  antragstellendePersonHasThirdNationality: "no",
  antragstellendePersonStrasse: "Main Street",
  antragstellendePersonHausnummer: "123",
  antragstellendePersonPlz: "12345",
  antragstellendePersonOrt: "Berlin",
  antragstellendePersonLand: "DE",
  antragstellendePersonAdresszusatz: "",
  antragstellendePersonRelationshipToErblasser: "daughter-son",
};

describe("copyAntragstellendePersonData", () => {
  it("should copy the antragstellende person data to the angehoerige section", async () => {
    const flowSession = createSession<NachlassErbscheinAnfrageUserData>();
    await copyAntragstellendePersonData(
      {} as Request,
      mockAntragstellendePersonData,
      flowSession,
    );
    expect(flowSession.data.beguenstigten).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          vorname: "John",
          nachname: "Doe",
          geburtsdatum: {
            day: "1",
            month: "1",
            year: "1990",
          },
          geburtsname: undefined,
          geburtsort: "",
          staatsangehoerigkeit: "DE",
          secondNationality: undefined,
          strasse: "Main Street",
          hausnummer: "123",
          plz: "12345",
          ort: "Berlin",
          land: "DE",
          adresszusatz: "",
          verhaeltnis: "daughter-son",
          isAlive: "yes",
        }),
      ]),
    );
  });

  describe("Dynamic relationship handling", () => {
    it("Should copy the antragstellende person data to ehepartner, if the relationship is spousal", async () => {
      const flowSession = createSession<NachlassErbscheinAnfrageUserData>();
      await copyAntragstellendePersonData(
        {} as Request,
        {
          ...mockAntragstellendePersonData,
          antragstellendePersonRelationshipToErblasser: "wife-husband",
        },
        flowSession,
      );
      expect(flowSession.data).toMatchObject({
        ehepartnerVorname: "John",
        ehepartnerNachname: "Doe",
        ehepartnerStaatsangehoerigkeit: "DE",
        ehepartnerHadSecondNationality: "no",
        ehepartnerStrasse: "Main Street",
        ehepartnerHausnummer: "123",
        ehepartnerPlz: "12345",
        ehepartnerOrt: "Berlin",
        ehepartnerAdresszusatz: "",
      });
    });

    it("Should copy the antragstellende person data to kind, if the relationship is child", async () => {
      const flowSession = createSession<NachlassErbscheinAnfrageUserData>();
      await copyAntragstellendePersonData(
        {} as Request,
        {
          ...mockAntragstellendePersonData,
          antragstellendePersonRelationshipToErblasser: "daughter-son",
        },
        flowSession,
      );
      expect(flowSession.data.beguenstigten).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            vorname: "John",
            nachname: "Doe",
            geburtsdatum: {
              day: "1",
              month: "1",
              year: "1990",
            },
            geburtsname: undefined,
            geburtsort: "",
            staatsangehoerigkeit: "DE",
            secondNationality: undefined,
            strasse: "Main Street",
            hausnummer: "123",
            plz: "12345",
            ort: "Berlin",
            land: "DE",
            adresszusatz: "",
            verhaeltnis: "daughter-son",
            isAlive: "yes",
          }),
        ]),
      );
    });

    it("Should copy the antragstellende person data to Elternteil, if the relationship is parent", async () => {
      const flowSession = createSession<NachlassErbscheinAnfrageUserData>();
      await copyAntragstellendePersonData(
        {} as Request,
        {
          ...mockAntragstellendePersonData,
          antragstellendePersonRelationshipToErblasser: "mother-father",
        },
        flowSession,
      );
      expect(flowSession.data.elternteile).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            vorname: "John",
            nachname: "Doe",
            geburtsdatum: {
              day: "1",
              month: "1",
              year: "1990",
            },
            geburtsname: undefined,
            geburtsort: "",
            staatsangehoerigkeit: "DE",
            secondNationality: undefined,
            strasse: "Main Street",
            hausnummer: "123",
            plz: "12345",
            ort: "Berlin",
            land: "DE",
            adresszusatz: "",
            verhaeltnis: "mother-father",
            isAlive: "yes",
          }),
        ]),
      );
    });

    it("Should copy the antragstellende person data to Enkelkind, if the relationship is enkelkind", async () => {
      const flowSession = createSession<NachlassErbscheinAnfrageUserData>();
      await copyAntragstellendePersonData(
        {} as Request,
        {
          ...mockAntragstellendePersonData,
          antragstellendePersonRelationshipToErblasser:
            "granddaughter-grandson",
        },
        flowSession,
      );
      expect(flowSession.data.kinder).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            kinder: expect.arrayContaining([
              expect.objectContaining({
                vorname: "John",
                nachname: "Doe",
                geburtsdatum: {
                  day: "1",
                  month: "1",
                  year: "1990",
                },
                geburtsort: "",
                staatsangehoerigkeit: "DE",
                strasse: "Main Street",
                hausnummer: "123",
                plz: "12345",
                ort: "Berlin",
                land: "DE",
                adresszusatz: "",
                verhaeltnis: "granddaughter-grandson",
                isAlive: "yes",
              }),
            ]),
          }),
        ]),
      );
    });

    it("Should copy the antragstellende person data to sister or brother, if the relationship is sibling", async () => {
      const flowSession = createSession<NachlassErbscheinAnfrageUserData>();
      await copyAntragstellendePersonData(
        {} as Request,
        {
          ...mockAntragstellendePersonData,
          antragstellendePersonRelationshipToErblasser: "sister-brother",
        },
        flowSession,
      );
      expect(flowSession.data.elternteile).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            kinder: expect.arrayContaining([
              expect.objectContaining({
                vorname: "John",
                nachname: "Doe",
                geburtsdatum: {
                  day: "1",
                  month: "1",
                  year: "1990",
                },
                geburtsort: "",
                staatsangehoerigkeit: "DE",
                strasse: "Main Street",
                hausnummer: "123",
                plz: "12345",
                ort: "Berlin",
                land: "DE",
                adresszusatz: "",
                verhaeltnis: "sister-brother",
                isAlive: "yes",
              }),
            ]),
          }),
        ]),
      );
    });

    it("Should copy the antragstellende person data to niece or nephew, if the relationship is niece or nephew", async () => {
      const flowSession = createSession<NachlassErbscheinAnfrageUserData>();
      await copyAntragstellendePersonData(
        {} as Request,
        {
          ...mockAntragstellendePersonData,
          antragstellendePersonRelationshipToErblasser: "niece-nephew",
        },
        flowSession,
      );
      expect(flowSession.data.elternteile).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            kinder: expect.arrayContaining([
              expect.objectContaining({
                kinder: expect.arrayContaining([
                  expect.objectContaining({
                    vorname: "John",
                    nachname: "Doe",
                    geburtsdatum: {
                      day: "1",
                      month: "1",
                      year: "1990",
                    },
                    geburtsort: "",
                    staatsangehoerigkeit: "DE",
                    strasse: "Main Street",
                    hausnummer: "123",
                    plz: "12345",
                    ort: "Berlin",
                    land: "DE",
                    adresszusatz: "",
                    verhaeltnis: "niece-nephew",
                    isAlive: "yes",
                  }),
                ]),
              }),
            ]),
          }),
        ]),
      );
    });
  });
});
