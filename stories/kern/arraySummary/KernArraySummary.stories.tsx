import type { Meta, StoryObj } from "@storybook/react-vite";
import KernArraySummary from "~/components/kern/arraySummary/KernArraySummary";
import type { ArrayConfigClient } from "~/services/array";
import { reactRouterContext } from ".storybook/reactRouterContext";

const meta = {
  title: "kern/arraySummary/KernArraySummary",
  component: KernArraySummary,
  tags: ["autodocs"],
  decorators: [(Story) => reactRouterContext(Story)],
} satisfies Meta<typeof KernArraySummary>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockArrayConfiguration: ArrayConfigClient = {
  event: "add-unterhaltszahlungen",
  initialInputUrl: "daten",
  url: "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person",
  disableAddButton: false,
};

const mockArrayData = {
  configuration: mockArrayConfiguration,
  data: [
    {
      birthday: "01.01.1950",
      familyRelationship: "mother",
      firstName: "Another",
      monthlyPayment: "100,00",
      surname: "test",
    },
  ],
};

const mockItemLabels = {
  birthday: "Geburtsdatum",
  familyRelationship: "Verwandtschaftsverhältnis",
  firstName: "Vorname",
  monthlyPayment: "Monatliche Zahlung",
  surname: "Nachname",
  "familyRelationship.mother": "Mutter",
};

export const Default: Story = {
  args: {
    category: "unterhaltszahlungen",
    arrayData: mockArrayData,
    csrf: "csrf-token",
    content: {
      title: {
        text: "Unterhaltszahlungen",
        tagName: "h2",
      },
      description: "Übersicht Ihrer angegebenen Unterhaltszahlungen",
      buttonLabel: "Weitere",
      subtitle: {
        text: "Person {{indexArray}}",
        tagName: "h3",
      },
      itemLabels: mockItemLabels,
    },
  },
};

export const WithDisabledAddButton: Story = {
  args: {
    category: "unterhaltszahlungen",
    arrayData: {
      ...mockArrayData,
      configuration: {
        ...mockArrayConfiguration,
        disableAddButton: true,
      },
    },
    csrf: "csrf-token",
    content: {
      title: {
        text: "Unterhaltszahlungen",
        tagName: "h2",
      },
      description: "Übersicht Ihrer angegebenen Unterhaltszahlungen",
      buttonLabel: "Weitere",
      subtitle: {
        text: "Person {{indexArray}}",
        tagName: "h3",
      },
      itemLabels: mockItemLabels,
    },
  },
};

export const WithMultipleItems: Story = {
  args: {
    category: "unterhaltszahlungen",
    arrayData: {
      configuration: mockArrayConfiguration,
      data: [
        {
          birthday: "01.01.1950",
          familyRelationship: "mother",
          firstName: "Another",
          monthlyPayment: "100,00",
          surname: "test",
        },
        {
          birthday: "15.05.1960",
          familyRelationship: "father",
          firstName: "John",
          monthlyPayment: "150,00",
          surname: "Doe",
        },
      ],
    },
    csrf: "csrf-token",
    content: {
      title: {
        text: "Unterhaltszahlungen",
        tagName: "h2",
      },
      description: "Übersicht Ihrer angegebenen Unterhaltszahlungen",
      buttonLabel: "Weitere",
      subtitle: {
        text: "Person {{indexArray}}",
        tagName: "h3",
      },
      itemLabels: {
        ...mockItemLabels,
        "familyRelationship.father": "Vater",
      },
    },
  },
};
