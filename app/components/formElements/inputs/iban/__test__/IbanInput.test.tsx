import { formatIban, ibanSchema } from "~/services/validation/iban";
import IbanInput from "../IbanInput";
import { userEvent } from "@testing-library/user-event";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { z } from "zod";
import { type JSX } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { FormProvider, useForm } from "@rvf/react";

const mockIBAN = "DE02120300000000202051";

vi.mock("~/components/hooks/useControlledField.tsx", () => ({
  useControlledField: () => ({
    SrAnnouncementComponent: null,
  }),
}));

const user = userEvent.setup();
const DEFAULT_EMPTY_IBAN = { iban: "" };

const RVFWrapper = ({
  children,
  defaultValues = DEFAULT_EMPTY_IBAN,
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

describe("IbanInput", () => {
  it("should render a user-entered IBAN with masked spaces between digit groups", async () => {
    const { getByLabelText } = render(
      <RVFWrapper>
        <IbanInput name="iban" label="IBAN" />
      </RVFWrapper>,
    );
    const input = getByLabelText("IBAN");

    expect(input).toHaveValue("");
    user.type(input, mockIBAN);
    await waitFor(() => {
      expect(input).toHaveValue(formatIban(mockIBAN));
    });
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
});
