import { fireEvent, render, waitFor } from "@testing-library/react";
import { formatIban, ibanSchema } from "~/services/validation/iban";
import { type BankData } from "../bankNameFromIBAN";
import IbanInput from "../IbanInput";
import { type JSX } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { FormProvider, useForm } from "@rvf/react";
import { z } from "zod";
import { userEvent } from "@testing-library/user-event";

const mockIBAN = "DE02120300000000202051";
/**
 * This swiss IBAN is valid, but doesn't match the German bank name database.
 */
const mockNonMatchingIBAN = "CH0209000000100013997";
const mockBankName = "Deutsche Kreditbank Suhl";

const { mockFieldSetValue, mockFieldValidate } = vi.hoisted(() => ({
  mockFieldSetValue: vi.fn().mockName("mockFieldSetValue"),
  mockFieldValidate: vi.fn(),
}));

vi.mock("@rvf/react-router", async () => ({
  ...(await vi.importActual("@rvf/react-router")),
  useFormContext: () => ({
    field: () => ({
      setValue: mockFieldSetValue,
      validate: mockFieldValidate,
    }),
  }),
}));

vi.mock("react", async () => ({
  ...(await vi.importActual("react")),
}));

vi.mock("~/components/formElements/inputs/iban/useBankData.ts", () => ({
  useBankData: vi.fn(
    () =>
      ({
        [Number(mockIBAN.substring(4, 12))]: mockBankName,
      }) as BankData,
  ),
}));

const RVFWrapper = ({
  children,
  defaultValues = { iban: "" },
}: {
  children: JSX.Element;
  defaultValues?: { iban: string };
}) => {
  const form = useForm({
    schema: z.object({ iban: ibanSchema }),
    defaultValues,
  });

  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <FormProvider scope={form.scope()}>
          <form {...form.getFormProps()}>{children}</form>
        </FormProvider>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

const user = userEvent.setup();

describe("IbanInput", () => {
  beforeEach(() => {
    /**
     * Workaround needed due to setTimeout, and react-testing-library not
     * supporting Vitest fake timers
     *
     * https://github.com/testing-library/react-testing-library/issues/1198#issuecomment-1554266941
     */
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should render a user-entered IBAN with masked spaces between digit groups", async () => {
    const { getByLabelText } = render(
      <RVFWrapper>
        <IbanInput name="iban" label="IBAN" />
      </RVFWrapper>,
    );
    const input = getByLabelText("IBAN");

    expect(input).toHaveValue("");
    user.type(input, mockIBAN);
    await waitFor(
      () => {
        expect(input).toHaveValue(formatIban(mockIBAN));
      },
      { timeout: 2000 },
    );
  });

  it("should accessibly announce to the user if the bank name is identified", async () => {
    const { getByLabelText, getByText } = render(
      <RVFWrapper>
        <IbanInput name="iban" label="IBAN" />
      </RVFWrapper>,
    );
    const input = getByLabelText("IBAN");

    user.type(input, mockIBAN);
    await waitFor(
      () => {
        expect(
          getByText(`Bank identifiziert: ${mockBankName}`),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it("should display an error if an invalid IBAN is entered", async () => {
    const { getByLabelText } = render(
      <RVFWrapper>
        <IbanInput
          name="iban"
          label="IBAN"
          errorMessages={[{ code: "invalid", text: "Invalid IBAN" }]}
        />
      </RVFWrapper>,
    );
    const input = getByLabelText("IBAN");

    user.type(input, "invalid iban");
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input.parentElement).toHaveClass("kern-form-input--error");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Automatic Bank Name feature", () => {
    it("should update the bankName field if the iban changes and it matches an existing bank", async () => {
      const { getByLabelText } = render(
        <RVFWrapper>
          <IbanInput name="iban" label="IBAN" />
        </RVFWrapper>,
      );
      const input = getByLabelText("IBAN");

      user.type(input, mockIBAN);

      await waitFor(
        () => {
          expect(mockFieldSetValue).toHaveBeenCalled();
          expect(mockFieldValidate).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });

    it("should only take action if the current iban differs from the intially-rendered iban", async () => {
      const { getByLabelText } = render(
        <RVFWrapper defaultValues={{ iban: "existing" }}>
          <IbanInput name="iban" label="IBAN" />
        </RVFWrapper>,
      );
      const input = getByLabelText("IBAN");

      user.type(input, "existing");

      await waitFor(
        () => {
          expect(mockFieldSetValue).not.toHaveBeenCalled();
          expect(mockFieldValidate).not.toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });

    it("should set the bank name field to an empty string if the iban becomes erased", async () => {
      const { getByLabelText } = render(
        <RVFWrapper defaultValues={{ iban: mockIBAN }}>
          <IbanInput name="iban" label="IBAN" />
        </RVFWrapper>,
      );
      const input = getByLabelText("IBAN");

      user.clear(input);

      await waitFor(
        () => {
          expect(mockFieldSetValue).toHaveBeenCalledWith("");
        },
        { timeout: 2000 },
      );
    });

    it("should set the bank name field to an empty string if the iban changes but no bank matches", async () => {
      const { getByLabelText } = render(
        <RVFWrapper>
          <IbanInput name="iban" label="IBAN" />
        </RVFWrapper>,
      );
      const input = getByLabelText("IBAN");

      user.type(input, mockNonMatchingIBAN);

      await waitFor(
        () => {
          expect(mockFieldSetValue).toHaveBeenCalledWith("");
        },
        { timeout: 2000 },
      );
    });
  });
});
