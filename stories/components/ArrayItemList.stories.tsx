import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeleteButton } from "~/components/common/DeleteButton";
import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";

const meta = {
  title: "components/ArrayItemList",
  component: ArrayItemListSection,
  tags: ["autodocs"],
} satisfies Meta<typeof ArrayItemListSection>;

export default meta;

type Story = StoryObj<typeof meta>;

const onDelete = () => Promise.resolve();

export const Default: Story = {
  args: {
    heading: "Natürliche Personen",
    headingId: "natuerliche-personen",
    helperText: "Fügen Sie alle beklagten natürlichen Personen hinzu.",
    addButton: { href: "#", buttonText: "Natürliche Person hinzufügen" },
    children: (
      <ArrayItemCard
        heading={{ text: "Beklagte Partei 1)", id: "beklagte-partei-0" }}
        content={
          <div className="flex flex-col kern-body kern-body--default">
            <span className="kern-body--bold">Max Mustermann</span>
            <span>Beispielstraße 1</span>
            <span>12345 Beispielstadt</span>
          </div>
        }
        editButton={{ href: "#", ariaLabel: "Beklagte Partei 1) bearbeiten" }}
        deleteButton={
          <DeleteButton
            label="Beklagte Partei 1) löschen"
            title="Beklagte Partei 1) löschen?"
            onDelete={onDelete}
          />
        }
      >
        <NestedArrayItemList
          heading="Gesetzliche Vertretung"
          headingId="beklagte-partei-0-gesetzliche-vertretung"
          headingSuffix="- Optional"
          subtitle="Zum Beispiel Eltern oder Betreuer"
          items={[
            {
              key: "vertreter-0",
              content: (
                <>
                  <span className="kern-body--bold">Erika Musterfrau</span>
                  <span>Beispielstraße 2</span>
                </>
              ),
              editButton: { href: "#", ariaLabel: "Erika bearbeiten" },
              deleteButton: { title: "Vertretung löschen?", onDelete },
            },
          ]}
          addLinks={[{ href: "#", label: "Gesetzliche Vertretung hinzufügen" }]}
        />
      </ArrayItemCard>
    ),
  },
};
