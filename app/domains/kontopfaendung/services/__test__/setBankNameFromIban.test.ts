import { type FieldApi } from "@rvf/react";
import { setBankNameFromIban } from "~/domains/kontopfaendung/services/setBankNameFromIban";

const { mockIBAN, mockBankName } = vi.hoisted(() => ({
  mockIBAN: "DE02120300000000202051",
  mockBankName: "Deutsche Kreditbank Suhl",
}));

/**
 * This swiss IBAN is valid, but doesn't match the German bank name database.
 */
const mockNonMatchingIBAN = "CH0209000000100013997";

const mockFieldSetValue = vi.fn();
const mockFieldValidate = vi.fn();

const mockControlledField = {
  setValue: mockFieldSetValue,
  validate: mockFieldValidate,
} as unknown as FieldApi<string>;

const mockSetControlledFieldSrValue = vi.fn();

vi.mock("~/services/bank/fetchBanks.ts", () => ({
  fetchBanks: vi.fn(() => ({
    [Number(mockIBAN.substring(4, 12))]: mockBankName,
  })),
}));

describe("setBankNameFromIban", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should update the bankName field if the iban changes and it matches an existing bank", async () => {
    await setBankNameFromIban({
      originalValue: "",
      value: mockIBAN,
      controlledField: mockControlledField,
      setControlledFieldSrValue: mockSetControlledFieldSrValue,
    });
    vi.runAllTimers();

    expect(mockFieldSetValue).toHaveBeenCalledWith(mockBankName);
    expect(mockSetControlledFieldSrValue).toHaveBeenCalledWith(mockBankName);
    expect(mockFieldValidate).toHaveBeenCalled();
  });

  it("should do nothing if the bank name hasn't changed", async () => {
    await setBankNameFromIban({
      originalValue: mockIBAN,
      value: mockIBAN,
      controlledField: mockControlledField,
      setControlledFieldSrValue: mockSetControlledFieldSrValue,
    });
    vi.runAllTimers();

    expect(mockFieldSetValue).not.toHaveBeenCalled();
    expect(mockSetControlledFieldSrValue).not.toHaveBeenCalled();
    expect(mockFieldValidate).not.toHaveBeenCalled();
  });

  it("should set the bank name field to an empty string if the iban becomes erased", async () => {
    await setBankNameFromIban({
      originalValue: mockIBAN,
      value: "",
      controlledField: mockControlledField,
      setControlledFieldSrValue: mockSetControlledFieldSrValue,
    });
    vi.runAllTimers();

    expect(mockFieldSetValue).toHaveBeenCalledWith("");
    expect(mockSetControlledFieldSrValue).toHaveBeenCalledWith("");
    expect(mockFieldValidate).not.toHaveBeenCalled();
  });

  it("should set the bank name field to an empty string if the iban changes but no bank matches", async () => {
    await setBankNameFromIban({
      originalValue: mockIBAN,
      value: mockNonMatchingIBAN,
      controlledField: mockControlledField,
      setControlledFieldSrValue: mockSetControlledFieldSrValue,
    });
    vi.runAllTimers();

    expect(mockFieldSetValue).toHaveBeenCalledWith("");
    expect(mockSetControlledFieldSrValue).toHaveBeenCalledWith("");
    expect(mockFieldValidate).not.toHaveBeenCalled();
  });
});
