import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import Container from "~/components/layout/Container";
import { ExclusiveCheckboxes } from "~/components/formElements/exclusiveCheckboxes/ExclusiveCheckboxes";

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

const options = ["checkboxOne", "checkboxTwo", "checkboxThree", "none"];

const labels = {
  checkboxOne: "One",
  checkboxTwo: "Two",
  checkboxThree: "Three",
  none: "None of the above",
};

export const Default: Story = {
  args: {
    name: "test",
    options,
    labels,
  },
  decorators: [
    (Story) => (
      <Container paddingTop="24" paddingBottom="64">
        {reactRouterFormContext(<Story />)}
      </Container>
    ),
  ],
};
