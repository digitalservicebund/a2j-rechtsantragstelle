import { render, renderHook, waitFor } from "@testing-library/react";
import { useControlledField } from "~/components/hooks/useControlledField";
import { type FieldValueChangeHandler } from "~/domains/pageSchemas";

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    value: vi.fn(),
  }),
  useFormContext: () => ({
    field: vi.fn(),
  }),
}));

const mockHandleFieldValueChange: FieldValueChangeHandler = ({
  setControlledFieldSrValue,
}) => {
  setControlledFieldSrValue("value");
};

describe("useControlledField", () => {
  it("should return a screenReader announcement component", () => {
    const { result } = renderHook(() =>
      useControlledField("iban", {
        fieldName: "bankName",
        handleFieldValueChange: mockHandleFieldValueChange,
        getScreenReaderAnnouncementText: () => "Bank name updated",
      }),
    );
    const { container } = render(result.current.SrAnnouncementComponent);
    const srComponent = container.querySelector("div");
    expect(srComponent).toBeDefined();
    expect(srComponent).toHaveAttribute("aria-live", "polite");
    expect(srComponent).toHaveTextContent("Bank name updated");
  });

  it("should call the field value change handler", async () => {
    const mockValueChangeHandler = vi.fn();
    renderHook(() =>
      useControlledField("iban", {
        fieldName: "bankName",
        getScreenReaderAnnouncementText: vi.fn(),
        handleFieldValueChange: mockValueChangeHandler,
      }),
    );
    await waitFor(() => {
      expect(mockValueChangeHandler).toHaveBeenCalled();
    });
  });
});
