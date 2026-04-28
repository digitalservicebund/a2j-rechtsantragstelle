import { useField } from "@rvf/react-router";
import { fireEvent, render, waitFor } from "@testing-library/react";
import KernIbanInput from "~/components/kern/formElements/input/KernIbanInput";
import { formatIban } from "~/services/validation/iban";

const mockValue = vi.fn();

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

/**
 * Deutsche Kreditbank Suhl
 */
const mockIBAN = "DE02120300000000202051";

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
        const bankNames = getAllByText("Deutsche Kreditbank Suhl");
        expect(bankNames).toHaveLength(2);
        expect(bankNames[0]).toHaveClass(
          "kern-label kern-label--small text-nowrap",
        );
      },
      { timeout: 1100 },
    );
  });
});
