import { reactRouterContext } from ".storybook/reactRouterContext";
import { RFCFormerProvider } from ".storybook/RFCFormerProvider";
import type { Meta, StoryObj } from "@storybook/react";
import { FieldSet } from "~/components/inputs/FieldSet";

const meta = {
  title: "Component/FieldSet",
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
    fieldSetGroup: {
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
    },
    image: {
      url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/1_Rechtliche_Unterstuetzung_904342381e.svg",
      alternativeText: "Example SVG marker",
      width: 24,
      height: 24,
    },
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};

export const FieldSetWithoutImage: Story = {
  args: {
    heading: "<p><strong>Heading</strong> fieldset value without image</p>",
    fieldSetGroup: {
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
    },
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};
