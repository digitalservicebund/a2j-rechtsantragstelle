import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "~/components/common/Icon";
import { type IconName } from "~/components/common/utils";

const allIconNames: IconName[] = [
  "airplanemode",
  "plus",
  "arrow-back",
  "arrow-downward",
  "arrow-forward",
  "arrow-upward",
  "check-circle",
  "close",
  "chevron-right",
  "chevron-left",
  "counter-1",
  "counter-2",
  "counter-3",
  "counter-4",
  "counter-5",
  "do-not-disturb-on",
  "download",
  "draft",
  "emergency-home",
  "euro-symbol",
  "edit",
  "home",
  "info",
  "keyboard-arrow-down",
  "keyboard-arrow-up",
  "keyboard-double-arrow-left",
  "local-library",
  "more-time",
  "no-luggage",
  "open-in-new",
  "sign-language",
  "thumb-down",
  "thumb-up",
  "trash",
  "warning",
];

const meta = {
  title: "components/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: allIconNames,
    },
    size: {
      control: "number",
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  args: {
    size: 24,
    name: allIconNames[0],
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "16px",
      }}
    >
      {allIconNames.map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            padding: "12px",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
          }}
        >
          <Icon name={name} size={24} />
          <span
            style={{ fontSize: "11px", textAlign: "center", color: "#666" }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};
