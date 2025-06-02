import { getAirportByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportByIataCode";
import { getCourtByStartAndEndAirport } from "~/domains/fluggastrechte/services/getCourtByStartAndEndAirport";
import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/shared/gerichtskosten";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { getCompensationPayment } from "../../../services/airports/getCompensationPayment";
import { getTotalClaimingPeople } from "../../services/getTotalClaimingPeople";
import { getTotalCompensationClaim } from "../../services/getTotalCompensationClaim";
import { type FluggastrechteUserData } from "../../userData";
import {
  getResponsibleAirportForCourt,
  getResponsibleCourt,
  getStreitwert,
  hasBothAirportsPartnerCourts,
} from "../legalCourts";

vi.mock("~/domains/fluggastrechte/services/airports/getAirportByIataCode");
vi.mock("~/domains/fluggastrechte/services/getCourtByStartAndEndAirport");
vi.mock("~/domains/geldEinklagen/shared/gerichtskosten");
vi.mock("../../../services/airports/getCompensationPayment");
vi.mock("../../services/getTotalClaimingPeople");
vi.mock("../../services/getTotalCompensationClaim");

describe("legalCourts", () => {
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

      const context: FluggastrechteUserData = {
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

      const context: FluggastrechteUserData = {};

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

      const context: FluggastrechteUserData = {
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

  describe("getResponsibleAirportForCourt", () => {
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
      zipCodePilotCourt: "hasZipCode",
    };
    const airportWithoutPartnerCourt = {
      ...mockAirportData,
      zipCodePilotCourt: "",
    };

    it("should return Startflughafen when the responsible court is based on the start airport", () => {
      vi.mocked(getAirportByIataCode).mockImplementation((airport) => {
        if (airport === "BER") {
          return airportWithPartnerCourt;
        }

        return airportWithoutPartnerCourt;
      });

      const context = {
        startAirport: "BER",
        endAirport: "JFK",
      };

      const actual = getResponsibleAirportForCourt(context);

      expect(actual).toEqual({
        responsibleAirportForCourt: "Startflughafen",
      });
    });

    it("should return Zielflughafen when the responsible court is based on the end airport", () => {
      vi.mocked(getAirportByIataCode).mockImplementation((airport) => {
        if (airport === "BER") {
          return airportWithPartnerCourt;
        }

        return airportWithoutPartnerCourt;
      });

      const context = {
        startAirport: "CDG",
        endAirport: "BER",
      };

      const actual = getResponsibleAirportForCourt(context);

      expect(actual).toEqual({
        responsibleAirportForCourt: "Zielflughafen",
      });
    });
  });
});
