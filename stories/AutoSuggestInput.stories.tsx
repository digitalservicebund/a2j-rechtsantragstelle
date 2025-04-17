import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import AutoSuggestInput from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import type { AutoSuggestInputProps } from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import { RFCFormerProvider } from ".storybook/RFCFormerProvider";

function getDataListValues<T extends { dataList?: any }>(
  props: T,
): T["dataList"][] {
  const keys = Object.keys(props) as (keyof T)[];

  return keys.reduce(
    (acc, key) => {
      if (key === "dataList" && props[key] !== undefined) {
        acc.push(props[key]);
      }
      return acc;
    },
    [] as T["dataList"][],
  );
}

const defaulType: AutoSuggestInputProps = {
  name: "autoSuggestInput",
  label: "Airports",
  noSuggestionMessage: "No data selected",
  errorMessages: undefined,
  dataList: "airports",
  width: "54",
  isDisabled: false,
};

const meta = {
  title: "Component/AutoSuggestInput",
  component: AutoSuggestInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    dataList: {
      options: getDataListValues<AutoSuggestInputProps>(defaulType),
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof AutoSuggestInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...defaulType,
  },
  decorators: [
    (Story) =>
      remixContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};

export const WithPlaceholder: Story = {
  args: {
    ...defaulType,
    placeholder: "With placeholder",
  },
  decorators: [
    (Story) =>
      remixContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};
