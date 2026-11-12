import { FormProvider, useForm } from "@rvf/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { AnnahmeverzugCheckbox } from "../AnnahmeverzugCheckbox";

const TestForm = ({ initialValue }: { initialValue?: "on" | "off" }) => {
  const form = useForm({
    schema: z.object({
      annahmeverzugsFeststellung: z.enum(["on", "off"]).optional(),
    }),
    defaultValues: { annahmeverzugsFeststellung: initialValue },
  });

  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()}>
        <AnnahmeverzugCheckbox
          name="annahmeverzugsFeststellung"
          parties={[]}
          selectedBeklagte={undefined}
          zahlungsantragIndex={0}
        />
      </form>
    </FormProvider>
  );
};

describe("AnnahmeverzugCheckbox", () => {
  it.each([
    { initialValue: "on", checked: true },
    { initialValue: "off", checked: false },
    { initialValue: undefined, checked: false },
  ] as const)(
    "loads saved value $initialValue with checked=$checked",
    ({ initialValue, checked }) => {
      render(<TestForm initialValue={initialValue} />);

      expect(screen.getByRole("checkbox")).toHaveProperty("checked", checked);
    },
  );

  it("allows a saved selection to be deselected and selected again", async () => {
    const user = userEvent.setup();
    render(<TestForm initialValue="on" />);
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
