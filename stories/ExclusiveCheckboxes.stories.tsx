import type { Meta, StoryObj } from "@storybook/react";
import { reactRouterContext } from ".storybook/reactRouterContext";
import Container from "~/components/layout/Container";
import { ExclusiveCheckboxes } from "~/components/formElements/exclusiveCheckboxes/ExclusiveCheckboxes";
import { exclusiveCheckboxesSchema } from "~/services/validation/checkedCheckbox";
import { type StrapiCheckboxComponent } from "~/services/cms/models/formElements/StrapiCheckbox";
import { RVFProvider } from ".storybook/RVFProvider";

const meta = {
  title: "FormElements/ExclusiveCheckboxes",
  component: ExclusiveCheckboxes,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ExclusiveCheckboxes>;

export default meta;

type Story = StoryObj<typeof meta>;

const cmsCheckboxes = [
  { name: "checkboxOne", label: "One" },
  { name: "checkboxTwo", label: "Two" },
  { name: "checkboxThree", label: "Three" },
  { name: "none", label: "None of the above" },
] as StrapiCheckboxComponent[];

const schema = exclusiveCheckboxesSchema([
  "checkboxOne",
  "checkboxTwo",
  "checkboxThree",
  "none",
]);

export const Default: Story = {
  args: {
    name: "",
    schema,
    cmsCheckboxes,
  },
  decorators: [
    (Story) => (
      <Container paddingTop="24" paddingBottom="64">
        {reactRouterContext(() => (
          <RVFProvider
            schema={schema}
            defaultValues={{
              checkboxOne: "on",
              checkboxTwo: "on",
              checkboxThree: "on",
              none: "off",
            }}
          >
            <Story />
          </RVFProvider>
        ))}
      </Container>
    ),
  ],
};
