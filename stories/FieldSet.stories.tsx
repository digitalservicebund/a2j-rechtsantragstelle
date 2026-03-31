import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldSet } from "~/components/formElements/FieldSet";
import demoImage from "./assets/Rechtliche_Unterstuetzung.svg?no-inline";

const meta = {
  title: "FormElements/FieldSet",
  component: FieldSet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FieldSet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FieldSetWithImage: Story = {
  args: {
    heading: "<p><strong>Heading</strong> fieldset value</p>",
    formComponents: [
      {
        name: "direktAbflugsDatum",
        label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
        errorMessages: [],
        id: 76,
        __component: "form-elements.date-input",
      },
      {
        name: "direktAbflugsZeit",
        label: "Zeit geplanter Abflug (z.B. 09:08)",
        errorMessages: [],
        id: 40,
        __component: "form-elements.time-input",
      },
    ],
    image: {
      url: demoImage,
      alternativeText: "Example SVG marker",
      width: 24,
      height: 24,
    },
    readOnlyFieldNames: [],
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const FieldSetWithoutImage: Story = {
  args: {
    heading: "<p><strong>Heading</strong> fieldset value without image</p>",
    formComponents: [
      {
        name: "direktAbflugsDatum",
        label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
        errorMessages: [],
        id: 76,
        __component: "form-elements.date-input",
      },
      {
        name: "direktAbflugsZeit",
        label: "Zeit geplanter Abflug (z.B. 09:08)",
        errorMessages: [],
        id: 40,
        __component: "form-elements.time-input",
      },
    ],
    readOnlyFieldNames: [],
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
