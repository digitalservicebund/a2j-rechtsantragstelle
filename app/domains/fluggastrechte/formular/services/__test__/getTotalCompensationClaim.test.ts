import { getCompensationPayment } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";
import { getTotalCompensationClaim } from "../getTotalCompensationClaim";

vi.mock("~/domains/fluggastrechte/services/airports/getCompensationPayment");
vi.mocked(getCompensationPayment).mockReturnValue("250");

afterAll(() => {
  vi.clearAllMocks();
});

describe("getTotalCompensationClaim", () => {
  it("should return 250 given one person to claim", () => {
    const mockContext = {
      startAirport: "BER",
      endAirport: "JFK",
    };

    const actual = getTotalCompensationClaim(mockContext);

    expect(actual).toBe(250);
  });

  it("should return 500 given one person to claim and more another person", () => {
    const mockContext = {
      startAirport: "BER",
      endAirport: "JFK",
      weiterePersonen: [
        {
          vorname: "vorname",
          nachname: "nachname",
          strasseHausnummer: "strasseHausnummer",
          plz: "plz",
          ort: "ort",
        },
      ],
    };

    const actual = getTotalCompensationClaim(mockContext);

    expect(actual).toBe(500);
  });

  it("should return 1000 given one person to claim and more three person", () => {
    const mockContext = {
      startAirport: "BER",
      endAirport: "JFK",
      weiterePersonen: [
        {
          vorname: "vorname",
          nachname: "nachname",
          strasseHausnummer: "strasseHausnummer",
          plz: "plz",
          ort: "ort",
        },
        {
          vorname: "vorname",
          nachname: "nachname",
          strasseHausnummer: "strasseHausnummer",
          plz: "plz",
          ort: "ort",
        },
        {
          vorname: "vorname",
          nachname: "nachname",
          strasseHausnummer: "strasseHausnummer",
          plz: "plz",
          ort: "ort",
        },
      ],
    };

    const actual = getTotalCompensationClaim(mockContext);

    expect(actual).toBe(1000);
  });

  it("should return 250 given one person to claim and weitere personen is empty", () => {
    const mockContext = {
      startAirport: "BER",
      endAirport: "JFK",
      weiterePersonen: [],
    };

    const actual = getTotalCompensationClaim(mockContext);

    expect(actual).toBe(250);
  });
});
