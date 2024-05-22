import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import SuggestionInput from "~/components/inputs/suggestionInput/SuggestionInput";
import type { SuggestionInputProps } from "~/components/inputs/suggestionInput/SuggestionInput";

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

const defaulType: SuggestionInputProps = {
  name: "suggestionInput",
  formId: "formId",
  label: "Airports",
  noSuggestionMessage: "No data selected",
  errorMessages: undefined,
  dataList: "airports",
  width: "54",
};

const meta = {
  title: "Component/SuggestionInput",
  component: SuggestionInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    dataList: {
      options: getDataListValues<SuggestionInputProps>(defaulType),
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof SuggestionInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...defaulType,
  },
  decorators: [(Story) => remixContext(Story)],
};

export const WithPlaceholder: Story = {
  args: {
    ...defaulType,
    placeholder: "With placeholder",
  },
  decorators: [(Story) => remixContext(Story)],
};
