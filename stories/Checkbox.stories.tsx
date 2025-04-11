import type { StoryObj } from "@storybook/react";
import Checkbox from "../app/components/inputs/Checkbox";
import { RFCFormerProvider } from "../.storybook/RFCFormerProvider";
import { remixContext } from ".storybook/remixContext";

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
  },
  decorators: [
    (Story) =>
      remixContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
} satisfies StoryObj<typeof meta>;
export default meta;
