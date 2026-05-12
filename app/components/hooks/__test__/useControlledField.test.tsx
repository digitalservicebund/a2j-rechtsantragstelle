import { render, renderHook, waitFor } from "@testing-library/react";
import { useControlledField } from "~/components/hooks/useControlledField";
import { kontopfaendungPkontoAntragPages } from "~/domains/kontopfaendung/pkonto/antrag/pages";

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    value: vi.fn(),
  }),
  useFormContext: () => ({
    field: vi.fn(),
  }),
}));

describe("useControlledField", () => {
  it("should return a screenreader announcement component", () => {
    const { result } = renderHook(() =>
      useControlledField(
        "iban",
        kontopfaendungPkontoAntragPages.bankdatenKontodaten
          .controlledFieldConfig,
      ),
    );
    const { container } = render(result.current.SrAnnouncementComponent);
    const srComponent = container.querySelector("div");
    expect(srComponent).toBeDefined();
    expect(srComponent).toHaveAttribute("aria-live", "polite");
  });

  it("should call the field value change handler", async () => {
    const mockValueChangeHandler = vi.fn();
    renderHook(() =>
      useControlledField("iban", {
        ...kontopfaendungPkontoAntragPages.bankdatenKontodaten
          .controlledFieldConfig,
        handleFieldValueChange: mockValueChangeHandler,
      }),
    );
    await waitFor(() => {
      expect(mockValueChangeHandler).toHaveBeenCalled();
    });
  });
});
