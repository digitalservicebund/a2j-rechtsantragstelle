import {
  antragstellendePersonDone,
  couldLiveFromUnterhalt,
  unterhaltBekommeIch,
  empfaengerIsAnderePerson,
  empfaengerIsChild,
} from "../guards";

describe("guards", () => {
  describe("empfaengerIsAnderePerson", () => {
    it("should return true if the user is filling out the form for someone other than themselves", () => {
      expect(
        empfaengerIsAnderePerson({
          context: {
            empfaenger: "otherPerson",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user is filling out the form for themselves", () => {
      expect(
        empfaengerIsAnderePerson({
          context: {
            empfaenger: "myself",
          },
        }),
      ).toBe(false);
    });

    it("should return false if the user hasn't answered the recipient question", () => {
      expect(
        empfaengerIsAnderePerson({
          context: {},
        }),
      ).toBe(false);
    });
  });

  describe("empfaengerIsChild", () => {
    it("should return true if the user is filling out the form for a child", () => {
      expect(
        empfaengerIsChild({
          context: {
            empfaenger: "child",
          },
        }),
      ).toBe(true);
    });
  });

  describe("unterhaltBekommeIch", () => {
    it("should return true if the user lives primarily from received support", () => {
      expect(
        unterhaltBekommeIch({
          context: { livesPrimarilyFromUnterhalt: "yes" },
        }),
      ).toBe(true);
    });

    it("should return false if the user does NOT live primarily from received support", () => {
      expect(
        unterhaltBekommeIch({
          context: { livesPrimarilyFromUnterhalt: "no" },
        }),
      ).toBe(false);
    });

    it("should return false if the user has not answered whether or not they live primarily from received support", () => {
      expect(
        unterhaltBekommeIch({
          context: {},
        }),
      ).toBe(false);
    });
  });

  describe("couldLiveFromUnterhalt", () => {
    it("should return true if the user could live from received support", () => {
      expect(
        couldLiveFromUnterhalt({
          context: { couldLiveFromUnterhalt: "yes" },
        }),
      ).toBe(true);
    });

    it("should return false if the user could not live from received support", () => {
      expect(
        couldLiveFromUnterhalt({
          context: { couldLiveFromUnterhalt: "no" },
        }),
      ).toBe(false);
    });

    it("should return false if the user has not answered whether or not they could live from received support", () => {
      expect(
        couldLiveFromUnterhalt({
          context: {},
        }),
      ).toBe(false);
    });
  });
});

describe("antragstellendePersonDone", () => {
  it("should return true if the user is applying for PKH on behalf of someone else", () => {
    expect(
      antragstellendePersonDone({ context: { empfaenger: "otherPerson" } }),
    ).toBe(true);
  });

  it("should return true if the user doesn't have a claim to unterhalt", () => {
    expect(
      antragstellendePersonDone({
        context: { empfaenger: "myself", unterhaltsanspruch: "keine" },
      }),
    ).toBe(true);
  });

  it("should return true if the user has a special claim to unterhalt", () => {
    expect(
      antragstellendePersonDone({
        context: {
          empfaenger: "myself",
          unterhaltsanspruch: "sonstiges",
          unterhaltsbeschreibung: "Beschreibung",
        },
      }),
    ).toBe(true);
    expect(
      antragstellendePersonDone({
        context: { empfaenger: "myself", unterhaltsanspruch: "sonstiges" },
      }),
    ).toBe(false);
  });

  it("should return true if the user has a claim to unterhalt, has entered an unterhalt sum, and does not live primarily from it", () => {
    expect(
      antragstellendePersonDone({
        context: {
          empfaenger: "myself",
          unterhaltsanspruch: "unterhalt",
          unterhaltsSumme: "100",
          livesPrimarilyFromUnterhalt: "no",
        },
      }),
    ).toBe(true);
  });

  it("should return true if the user has a claim to unterhalt, lives primarily from it, and has entered all details relating to it", () => {
    expect(
      antragstellendePersonDone({
        context: {
          empfaenger: "myself",
          unterhaltsanspruch: "unterhalt",
          unterhaltsSumme: "100",
          livesPrimarilyFromUnterhalt: "yes",
          unterhaltspflichtigePerson: {
            beziehung: "ex-spouse",
            nachname: "Mustermann",
            vorname: "Max",
          },
        },
      }),
    ).toBe(true);
  });

  it("should return true if the user has an unpaid claim to unterhalt, and could not live from it", () => {
    expect(
      antragstellendePersonDone({
        context: {
          empfaenger: "myself",
          unterhaltsanspruch: "anspruchNoUnterhalt",
          couldLiveFromUnterhalt: "no",
        },
      }),
    ).toBe(true);
  });

  it("should return true if the user has an unpaid claim to unterhalt, could live from it, and has filled out all details about it", () => {
    expect(
      antragstellendePersonDone({
        context: {
          empfaenger: "myself",
          unterhaltsanspruch: "anspruchNoUnterhalt",
          couldLiveFromUnterhalt: "yes",
          personWhoCouldPayUnterhaltBeziehung: "ex-spouse",
          whyNoUnterhalt: "Keine Lust",
        },
      }),
    ).toBe(true);
  });

  it("should return true if the user is applying for PKH on behalf of a child and said child doesn't qualify for Vereinfachte Erklärung", () => {
    expect(
      antragstellendePersonDone({
        context: {
          empfaenger: "child",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "01.01.2000",
            unterhaltsSumme: "100",
          },
          livesTogether: "no",
          minderjaehrig: "no",
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "abstammung",
          hasEinnahmen: "no",
          unterhaltsanspruch: "keine",
        },
      }),
    ).toBe(true);
  });
});
