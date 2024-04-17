import {
  COMPENSATION_VALUE_ABOVE_3000_KM,
  COMPENSATION_VALUE_UNTIL_1500_KM,
  COMPENSATION_VALUE_UNTIL_3000_KM,
  getCompensantionPaymentString,
} from "~/models/flows/fluggastrechte/stringReplacements";
import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";

jest.mock("~/util/calculateDistanceBetweenAirports");

const mockedCalculateDistanceBetweenAirports =
  calculateDistanceBetweenAirportsInKilometers as jest.Mocked<
    typeof calculateDistanceBetweenAirportsInKilometers
  >;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getCompensantionPaymentString", () => {
  it("if the distance is until 1500, it should return compensation value until 1500", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(1500);

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_UNTIL_1500_KM,
    });
  });

  it("if the distance is until 3000, it should return compensation value until 3000", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(3000);

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_UNTIL_3000_KM,
    });
  });

  it("if the distance is above 3000, it should return compensation value above 3000", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(3001);

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_ABOVE_3000_KM,
    });
  });
});
