import type { StoryObj } from "@storybook/react";
import Checkbox from "../app/components/inputs/Checkbox";
import { RVFProvider } from "../.storybook/RVFProvider";
import { reactRouterContext } from ".storybook/reactRouterContext";

const meta = {
  title: "Component/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    name: "name",
    label: "label",
    required: true,
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RVFProvider>
          <Story />
        </RVFProvider>
      )),
  ],
} satisfies StoryObj<typeof meta>;
export default meta;
