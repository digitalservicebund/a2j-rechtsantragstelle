import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/shared/gerichtskosten";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { getAirportByIataCode } from "../../services/airports/getAirportByIataCode";
import { getAirportNameByIataCode } from "../../services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "../../services/airports/getCompensationPayment";
import { getCourtByStartAndEndAirport } from "../../services/getCourtByStartAndEndAirport";
import type { FluggastrechtContext } from "../context";
import { getTotalClaimingPeople } from "../services/getTotalClaimingPeople";
import { getTotalCompensationClaim } from "../services/getTotalCompensationClaim";
import {
  getAirlineName,
  getAnnullierungInfo,
  getArrayWeiterePersonenIndexStrings,
  getEndAirportName,
  getFirstZwischenstoppAirportName,
  getPersonNachname,
  getPersonVorname,
  getResponsibleCourt,
  getSecondZwischenstoppAirportName,
  getStartAirportName,
  getStreitwert,
  getThirdZwischenstoppAirportName,
  getWeiterePersonenNameStrings,
  hasBothAirportsPartnerCourts,
  isAnnullierung,
  isNichtBefoerderung,
  isVerspaetet,
  isWeiterePersonen,
} from "../stringReplacements";

vi.mock("../../services/airports/getCompensationPayment");
vi.mock("../../services/airports/getAirportNameByIataCode");
vi.mock("../../services/airports/getAirportByIataCode");
vi.mock("~/domains/geldEinklagen/shared/gerichtskosten");
vi.mock("../services/getTotalClaimingPeople");
vi.mock("../services/getTotalCompensationClaim");

describe("stringReplacements", () => {
  describe("getArrayWeiterePersonenIndexStrings", () => {
    it("should return an array weitere personen index for given context", () => {
      const context = {
        pageData: {
          arrayIndexes: [3],
        },
      };

      const arrayIndexStrings = getArrayWeiterePersonenIndexStrings(context);

      expect(arrayIndexStrings).toEqual({ "arrayWeiterePersonen#index": "5" });
    });

    it("should return an empty object for given context when arrayWeiterePersonen are not passed", () => {
      const arrayIndexStrings = getArrayWeiterePersonenIndexStrings({});

      expect(arrayIndexStrings).toEqual({});
    });
  });

  describe("getWeiterePersonenNameStrings", () => {
    it("should return vorname and nachname for given context", () => {
      const context: FluggastrechtContext = {
        weiterePersonen: [
          {
            title: "",
            vorname: "vorname",
            nachname: "nachname",
            strasseHausnummer: "strasseHausnummer",
            ort: "ort",
            plz: "plz",
          },
        ],
        pageData: {
          arrayIndexes: [0],
        },
      };

      const weiterePersonenNameStrings = getWeiterePersonenNameStrings(context);

      expect(weiterePersonenNameStrings).toEqual({
        "weiterePersonen#vorname": context.weiterePersonen?.[0].vorname,
        "weiterePersonen#nachname": context.weiterePersonen?.[0].nachname,
      });
    });

    it("should return an empty object when arrayIndex is too high", () => {
      const context: FluggastrechtContext = {
        weiterePersonen: [
          {
            title: "",
            vorname: "vorname",
            nachname: "nachname",
            strasseHausnummer: "strasseHausnummer",
            ort: "ort",
            plz: "plz",
          },
        ],
        pageData: {
          arrayIndexes: [5],
        },
      };

      const weiterePersonenNameStrings = getWeiterePersonenNameStrings(context);

      expect(weiterePersonenNameStrings).toEqual({});
    });

    it("should return an empty object for given context when arrayIndexes missing", () => {
      const weiterePersonenNameStrings = getWeiterePersonenNameStrings({});

      expect(weiterePersonenNameStrings).toEqual({});
    });

    it("should return an empty object for given context when kinder is undefined", () => {
      const context = {
        weiterePersonen: undefined,
        pageData: {
          arrayIndexes: [3],
        },
      };

      const weiterePersonenNameStrings = getWeiterePersonenNameStrings(context);

      expect(weiterePersonenNameStrings).toEqual({});
    });
  });

  describe("getStartAirportName", () => {
    it("should return the correct name of the airport", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue(
        "Berlin Brandenburg Flughafen (BER)",
      );
      const actual = getStartAirportName({ startAirport: "BER" });
      expect(actual).toStrictEqual({
        startAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have airport as parameter", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValueOnce("");
      const actual = getStartAirportName({});
      expect(actual).toStrictEqual({});
    });
  });

  describe("getEndAirportName", () => {
    it("should return the correct name of the airport", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue(
        "Berlin Brandenburg Flughafen (BER)",
      );
      const actual = getEndAirportName({ endAirport: "BER" });
      expect(actual).toStrictEqual({
        endAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have airport as parameter", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue("");
      const actual = getEndAirportName({});
      expect(actual).toStrictEqual({});
    });
  });

  describe("getPersonVorname", () => {
    it("should return the person vorname for a given context", () => {
      const context = {
        vorname: "vorname",
      };

      const actual = getPersonVorname(context);

      expect(actual).toEqual({ personVorname: context.vorname });
    });
  });

  describe("getPersonNachname", () => {
    it("should return the person nachname for a given context", () => {
      const context = {
        nachname: "nachname",
      };

      const actual = getPersonNachname(context);

      expect(actual).toEqual({ personNachname: context.nachname });
    });
  });

  describe("getAirlineName", () => {
    it("should return the airline name given an exist airline code", () => {
      const context = {
        fluggesellschaft: "LH",
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({ airlineName: "Deutsche Lufthansa AG" });
    });

    it("should return not airline name given an exist non airline code", () => {
      const context = {
        fluggesellschaft: "XXX",
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({});
    });

    it("should return an empty given undefined fluggesellschaft", () => {
      const context = {
        fluggesellschaft: undefined,
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({});
    });
  });

  describe("getFirstZwischenstoppAirportName", () => {
    it("should return the correct name of the first zwischenstopp", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue(
        "Berlin Brandenburg Flughafen (BER)",
      );
      const actual = getFirstZwischenstoppAirportName({
        ersterZwischenstopp: "BER",
      });
      expect(actual).toStrictEqual({
        firstZwischenstoppAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have first zwischenstopp as parameter", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue("");
      const actual = getFirstZwischenstoppAirportName({});
      expect(actual).toStrictEqual({});
    });
  });

  describe("getSecondZwischenstoppAirportName", () => {
    it("should return the correct name of the second zwischenstopp", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue(
        "Berlin Brandenburg Flughafen (BER)",
      );
      const actual = getSecondZwischenstoppAirportName({
        zweiterZwischenstopp: "BER",
      });
      expect(actual).toStrictEqual({
        secondZwischenstoppAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have second zwischenstopp as parameter", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue("");
      const actual = getSecondZwischenstoppAirportName({});
      expect(actual).toStrictEqual({});
    });
  });

  describe("getThirdZwischenstoppAirportName", () => {
    it("should return the correct name of the third zwischenstopp", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue(
        "Berlin Brandenburg Flughafen (BER)",
      );
      const actual = getThirdZwischenstoppAirportName({
        dritterZwischenstopp: "BER",
      });
      expect(actual).toStrictEqual({
        thirdZwischenstoppAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have third zwischenstopp as parameter", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue("");
      const actual = getEndAirportName({});
      expect(actual).toStrictEqual({});
    });
  });

  describe("isVerspaetet", () => {
    it("should return isVerspaetet as true if the bereich is verspaetet", () => {
      const actual = isVerspaetet({ bereich: "verspaetet" });

      expect(actual).toStrictEqual({ isVerspaetet: true });
    });

    it("should return isVerspaetet as false if the bereich is not verspaetet", () => {
      const actual = isVerspaetet({ bereich: "nichtbefoerderung" });

      expect(actual).toStrictEqual({ isVerspaetet: false });
    });
  });

  describe("isNichtBefoerderung", () => {
    it("should return isNichtBefoerderung as true if the bereich is nichtbefoerderung", () => {
      const actual = isNichtBefoerderung({
        bereich: "nichtbefoerderung",
      });

      expect(actual).toStrictEqual({ isNichtBefoerderung: true });
    });

    it("should return isNichtBefoerderung as false if the bereich is not nichtbefoerderung", () => {
      const actual = isNichtBefoerderung({
        bereich: "verspaetet",
      });

      expect(actual).toStrictEqual({ isNichtBefoerderung: false });
    });
  });

  describe("isAnnullierung", () => {
    it("should return isAnnullierung as true if the bereich is annullierung", () => {
      const actual = isAnnullierung({
        bereich: "annullierung",
      });

      expect(actual).toStrictEqual({ isAnnullierung: true });
    });

    it("should return isAnnullierung as false if the bereich is not annullierung", () => {
      const actual = isAnnullierung({
        bereich: "verspaetet",
      });

      expect(actual).toStrictEqual({ isAnnullierung: false });
    });
  });

  describe("isWeiterePersonen", () => {
    it("should return isWeiterePersonen as true if the isWeiterePersonen is yes", () => {
      const actual = isWeiterePersonen({
        isWeiterePersonen: "yes",
      });

      expect(actual).toStrictEqual({ isWeiterePersonen: true });
    });

    it("should return isWeiterePersonen as false if the isWeiterePersonen is no", () => {
      const actual = isWeiterePersonen({
        isWeiterePersonen: "no",
      });

      expect(actual).toStrictEqual({ isWeiterePersonen: false });
    });
  });

  describe("getResponsibleCourt", () => {
    vi.mock("~/domains/fluggastrechte/services/getCourtByStartAndEndAirport");
    it("should return court data ", () => {
      vi.mocked(getCourtByStartAndEndAirport).mockReturnValue({
        BEZEICHNUNG: "Amtsgericht",
        STR_HNR: "Strasse 5",
        PLZ_ZUSTELLBEZIRK: "11111",
        ORT: "Berlin",
        URL1: "www.amtsgericht.de",
        TEL: "123 4567",
      } as Jmtd14VTErwerberGerbeh);
      const actual = getResponsibleCourt({
        startAirport: "BER",
        endAirport: "FRA",
      });

      expect(actual).toStrictEqual({
        courtName: "Amtsgericht",
        courtStreetAndNumber: "Strasse 5",
        courtZipCode: "11111",
        courtCity: "Berlin",
        courtWebsite: "www.amtsgericht.de",
        courtTelephone: "123 4567",
        courtTelephoneNoSpace: "1234567",
      });
    });

    it("should return empty when no airports are provided", () => {
      vi.mocked(getCourtByStartAndEndAirport).mockReturnValue(undefined);
      const actual = getResponsibleCourt({
        startAirport: "",
        endAirport: "",
      });
      expect(actual).toStrictEqual({});
    });
  });

  describe("getStreitwert", () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should return the correct streitwert values", () => {
      vi.mocked(gerichtskostenFromBetrag).mockReturnValue(174);
      vi.mocked(getCompensationPayment).mockReturnValue("250");
      vi.mocked(getTotalClaimingPeople).mockReturnValue(3);
      vi.mocked(getTotalCompensationClaim).mockReturnValue(750);

      const context: FluggastrechtContext = {
        weiterePersonen: [
          { vorname: "Zweiter", nachname: "Person" },
          { vorname: "Dritter", nachname: "Person" },
        ],
      };

      const expected = {
        courtCost: "174",
        singleCompensation: "250",
        totalClaimingPeople: "3",
        totalCompensation: "750",
      };

      const actual = getStreitwert(context);
      expect(actual).toEqual(expected);
    });

    it("should return empty values when context is missing data", () => {
      vi.mocked(gerichtskostenFromBetrag).mockReturnValue(114);
      vi.mocked(getCompensationPayment).mockReturnValue("");
      vi.mocked(getTotalClaimingPeople).mockReturnValue(1);
      vi.mocked(getTotalCompensationClaim).mockReturnValue(0);

      const context: FluggastrechtContext = {};

      const expected = {
        courtCost: "114",
        singleCompensation: "",
        totalClaimingPeople: "1",
        totalCompensation: "0",
      };

      const actual = getStreitwert(context);
      expect(actual).toEqual(expected);
    });

    it("should handle empty weiterePersonen array", () => {
      vi.mocked(gerichtskostenFromBetrag).mockReturnValue(114);
      vi.mocked(getCompensationPayment).mockReturnValue("250");
      vi.mocked(getTotalClaimingPeople).mockReturnValue(1);
      vi.mocked(getTotalCompensationClaim).mockReturnValue(250);

      const context: FluggastrechtContext = {
        weiterePersonen: [],
      };

      const expected = {
        courtCost: "114",
        singleCompensation: "250",
        totalClaimingPeople: "1",
        totalCompensation: "250",
      };

      const actual = getStreitwert(context);
      expect(actual).toEqual(expected);
    });
  });

  describe("getAnnullierungInfo", () => {
    it("should return correct annullierung info based on context", () => {
      const context: FluggastrechtContext = {
        ersatzflugStartenEinStunde: "yes",
        ersatzflugLandenZweiStunden: "yes",
      };

      const result = getAnnullierungInfo(context);

      expect(result).toEqual({
        hasAnnullierungCase: false,
        hasBetween7And13DaysAnkuendigung: false,
        hasErsatzflugLandenVierStunden: false,
        hasErsatzflugLandenZweiStunden: true,
        hasErsatzflugStartenEinStunde: true,
        hasErsatzflugStartenZweiStunden: false,
        hasErsatzverbindungAngebot: false,
        hasMoreThan13DaysAnkuendigung: false,
        hasNoAnkuendigung: false,
        hasUntil6DaysAnkuendigung: false,
      });
    });
  });

  describe("hasBothAirportsPartnerCourts", () => {
    const mockAirportData = {
      iata: "",
      country_code: "",
      airport: "",
      latitude: 0,
      longitude: 0,
      city: "",
      country: "",
    };

    const airportWithPartnerCourt = {
      ...mockAirportData,
      zipCodePilotCourt: "something",
    };
    const airportWithoutPartnerCourt = {
      ...mockAirportData,
      zipCodePilotCourt: "",
    };

    it("should return bothAirportsPartnerCourts true when both airports are partner courts", () => {
      vi.mocked(getAirportByIataCode).mockImplementation((airport) => {
        if (airport === "BER") {
          return airportWithPartnerCourt;
        }

        return airportWithPartnerCourt;
      });

      const context = {
        startAirport: "BER",
        endAirport: "FRA",
      };

      const actual = hasBothAirportsPartnerCourts(context);

      expect(actual).toEqual({
        hasBothAirportsPartnerCourts: true,
      });
    });

    it("should return bothAirportsPartnerCourts true when startAirport is not a partner court", () => {
      vi.mocked(getAirportByIataCode).mockImplementation((airport) => {
        if (airport === "BER") {
          return airportWithoutPartnerCourt;
        }

        return airportWithPartnerCourt;
      });

      const context = {
        startAirport: "JFK",
        endAirport: "BER",
      };

      const actual = hasBothAirportsPartnerCourts(context);

      expect(actual).toEqual({
        hasBothAirportsPartnerCourts: false,
      });
    });

    it("should return bothAirportsPartnerCourts true when endAirport is not a partner court", () => {
      vi.mocked(getAirportByIataCode).mockImplementation((airport) => {
        if (airport === "BER") {
          return airportWithoutPartnerCourt;
        }

        return airportWithPartnerCourt;
      });

      const context = {
        startAirport: "BER",
        endAirport: "JFK",
      };

      const actual = hasBothAirportsPartnerCourts(context);

      expect(actual).toEqual({
        hasBothAirportsPartnerCourts: false,
      });
    });
  });
});
