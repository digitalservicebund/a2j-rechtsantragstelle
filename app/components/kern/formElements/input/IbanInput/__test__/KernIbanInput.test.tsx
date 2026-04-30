import { useField } from "@rvf/react-router";
import { fireEvent, render, waitFor } from "@testing-library/react";
import KernIbanInput from "~/components/kern/formElements/input/IbanInput/KernIbanInput";
import { type BankData } from "~/components/kern/formElements/input/IbanInput";
import { formatIban } from "~/services/validation/iban";

const mockValue = vi.fn();
const mockIBAN = "DE02120300000000202051";
const mockBankName = "Deutsche Kreditbank Suhl";

vi.mock("@rvf/react-router");
vi.mocked(useField).mockImplementation(
  () =>
    ({
      value: mockValue,
      error: vi.fn(),
      getInputProps: vi.fn(
        () =>
          ({
            id: "iban",
          }) as any,
      ),
    }) as any,
);

vi.mock("~/components/kern/formElements/input/IbanInput/useBankData", () => ({
  useBankData: vi.fn(
    () =>
      ({
        [Number(mockIBAN.substring(4, 12))]: mockBankName,
      }) as BankData,
  ),
}));

describe("KernIbanInput", () => {
  it("should render a user-entered IBAN with masked spaces between digit groups", async () => {
    const { getByLabelText } = render(
      <KernIbanInput name="iban" label="IBAN" />,
    );
    const input = getByLabelText("IBAN");

    expect(input).toHaveValue("");
    fireEvent.input(input, { target: { value: mockIBAN } });
    await waitFor(() => {
      expect(input).toHaveValue(formatIban(mockIBAN));
    });
  });

  it("should display the matching bank name if found", async () => {
    mockValue.mockReturnValue(mockIBAN);
    const { getAllByText } = render(<KernIbanInput name="iban" label="IBAN" />);

    await waitFor(
      () => {
        const bankNames = getAllByText(mockBankName);
        expect(bankNames).toHaveLength(2);
        expect(bankNames[0]).toHaveClass("kern-label kern-label--small");
      },
      { timeout: 1100 },
    );
  });
});
