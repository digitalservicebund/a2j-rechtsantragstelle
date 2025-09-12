import type { Meta, StoryObj } from "@storybook/react";
import AutoSuggestInput from "~/components/formElements/AutoSuggestInput";
import type { AutoSuggestInputProps } from "~/components/formElements/autoSuggestInput/types";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";

function getDataListValues<T extends { dataList?: any }>(
  props: T,
): Array<T["dataList"]> {
  const keys = Object.keys(props) as Array<keyof T>;

  return keys.reduce(
    (acc, key) => {
      if (key === "dataList" && props[key] !== undefined) {
        acc.push(props[key]);
      }
      return acc;
    },
    [] as Array<T["dataList"]>,
  );
}

const defaultType: AutoSuggestInputProps = {
  name: "autoSuggestInput",
  label: "Airports",
  noSuggestionMessage: "No data selected",
  errorMessages: undefined,
  supportsFreeText: false,
  dataList: "airports",
  width: "54",
  isDisabled: false,
};

const meta = {
  title: "FormElements/AutoSuggestInput",
  component: AutoSuggestInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    dataList: {
      options: getDataListValues<AutoSuggestInputProps>(defaultType),
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof AutoSuggestInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...defaultType,
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithPlaceholder: Story = {
  args: {
    ...defaultType,
    placeholder: "With placeholder",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithFreeTextInput: Story = {
  args: {
    ...defaultType,
    supportsFreeText: true,
    label: "Free Text selection",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
