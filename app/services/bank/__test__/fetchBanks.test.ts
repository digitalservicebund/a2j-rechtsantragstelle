import { type BankData } from "~/services/bank/bankNameFromIBAN";
import { fetchBanks } from "~/services/bank/fetchBanks";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("fetchBanks", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return undefined if the api call fails", async () => {
    mockFetch.mockImplementation(() => {
      throw new Error("API broken :(");
    });
    expect(await fetchBanks()).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should return undefined if response is not ok", async () => {
    mockFetch.mockImplementation(() => ({
      ok: false,
    }));

    expect(await fetchBanks()).toBeUndefined();
  });

  it("should return the bank data if the api call succeeds", async () => {
    const mockBankData: BankData = {
      [12345678]: "Bank Name",
    };
    mockFetch.mockImplementation(() => ({
      ok: true,
      json: () => Promise.resolve(mockBankData),
    }));

    expect(await fetchBanks()).toBe(mockBankData);
  });
});
