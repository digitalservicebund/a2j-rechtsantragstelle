import { FormProvider, useForm } from "@rvf/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { z } from "zod";
import type { GeldEinklagenAnwaltschaftUserData } from "../../../userData";
import { parteivernehmungSchema } from "../../../tatsachenvortrag/tatsachenvortragSchemas";
import { KlageParteiCheckboxes } from "../KlageParteiCheckboxes";

const ids = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
];

const address = {
  strasse: "Strasse",
  hausnummer: "1",
  plz: "12345",
  ort: "Ort",
  land: "Deutschland",
};

const person = {
  ...address,
  anrede: "frau" as const,
  titel: "",
  nachname: "Test",
};

const organisation = (name: string) => ({
  ...address,
  type: "organisation" as const,
  id: crypto.randomUUID(),
  orgName: name,
  orgVertretungId: crypto.randomUUID(),
  orgVertretungArt: "geschaeftsfuehrer-geschaeftsfuehrerin" as const,
  orgVertretungAnrede: "frau" as const,
  orgVertretungTitel: "",
  orgVertretungVorname: `${name} Hauptvertretung`,
  orgVertretungNachname: "Test",
  "gesetzliche-vertretung": [
    {
      ...person,
      id: crypto.randomUUID(),
      vorname: `${name} weitere Vertretung`,
      art: "vorstand-vorstaendin" as const,
    },
  ],
});

const naturalPerson = (name: string) => ({
  ...person,
  id: crypto.randomUUID(),
  type: "natuerliche-person" as const,
  vorname: name,
  "gesetzliche-vertretung": [
    {
      ...person,
      id: crypto.randomUUID(),
      vorname: `${name} Vertretung`,
      art: "elternteil" as const,
    },
  ],
});

const userData = {
  klagenden: [
    {
      ...person,
      id: ids[0],
      type: "natuerliche-person",
      vorname: "Klage",
      "gesetzliche-vertretung": [
        { ...person, id: ids[1], vorname: "Vertreterin", art: "elternteil" },
      ],
    },
  ],
  beklagten: [
    {
      ...person,
      id: ids[2],
      type: "natuerliche-person",
      vorname: "Beklagte",
      "gesetzliche-vertretung": [
        {
          ...person,
          id: ids[3],
          vorname: "Vertreter",
          art: "vormund-vormundin",
        },
      ],
    },
  ],
} satisfies GeldEinklagenAnwaltschaftUserData;

const TestForm = ({
  relationship,
  includeGesetzlicheVertretung = false,
  enableRemoval = false,
  initialData = userData,
  showIndex = false,
}: {
  relationship?: "klagende" | "beklagte";
  includeGesetzlicheVertretung?: boolean;
  enableRemoval?: boolean;
  initialData?: GeldEinklagenAnwaltschaftUserData;
  showIndex?: boolean;
}) => {
  const [parties, setParties] =
    useState<GeldEinklagenAnwaltschaftUserData>(initialData);
  const form = useForm({
    schema: z.object({ personen: z.record(z.string(), z.string()) }),
    defaultValues: { personen: { [ids[1]]: "on" } },
  });
  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()} aria-label="Formular">
        <KlageParteiCheckboxes
          name="personen"
          userData={parties}
          label="Personen"
          relationship={relationship}
          includeGesetzlicheVertretung={includeGesetzlicheVertretung}
          getCheckboxLabel={(index, party, side, representative) =>
            `${side}${showIndex ? ` ${index + 1}` : ""}: ${representative?.vorname ?? (party.type === "natuerliche-person" ? party.vorname : party.orgName)}`
          }
        />
        {enableRemoval && (
          <button
            type="button"
            onClick={() => setParties({ ...parties, klagenden: [] })}
          >
            Remove klagende
          </button>
        )}
      </form>
    </FormProvider>
  );
};

const renderForm = (props: React.ComponentProps<typeof TestForm> = {}) => {
  const router = createMemoryRouter([
    { path: "/", element: <TestForm {...props} /> },
  ]);
  render(<RouterProvider router={router} />);
};

describe("KlageParteiCheckboxes", () => {
  it.each(["klagende", "beklagte"] as const)(
    "renders only %s without representatives by default",
    (relationship) => {
      renderForm({ relationship });
      expect(screen.getAllByRole("checkbox")).toHaveLength(1);
      expect(
        screen.getByRole("checkbox", { name: new RegExp(relationship) }),
      ).toBeInTheDocument();
    },
  );

  it("shows both klagende and beklagte and their representatives and submits independent selections", async () => {
    renderForm({ includeGesetzlicheVertretung: true });
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(
      screen.getByRole("checkbox", { name: "klagende: Vertreterin" }),
    ).toBeChecked();
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("checkbox", { name: "beklagte: Vertreter" }),
    );
    await user.click(screen.getByRole("checkbox", { name: "klagende: Klage" }));
    const formData = new FormData(
      screen.getByRole("form", { name: "Formular" }) as HTMLFormElement,
    );
    expect(ids.map((id) => formData.getAll(`personen.${id}`))).toEqual([
      ["on"],
      ["on"],
      ["off"],
      ["on"],
    ]);
  });

  it("limits representatives to the selected relationship (klagende or beklagte) and clears unavailable selections", () => {
    renderForm({
      relationship: "beklagte",
      includeGesetzlicheVertretung: true,
    });
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    const formData = new FormData(
      screen.getByRole("form", { name: "Formular" }) as HTMLFormElement,
    );
    expect(formData.get(`personen.${ids[1]}`)).toBe("off");
    expect(formData.get(`personen.${ids[2]}`)).toBe("off");
    expect(formData.get(`personen.${ids[3]}`)).toBe("off");
  });

  it("keeps selected checkbox identity when the list changes", async () => {
    renderForm({ includeGesetzlicheVertretung: true, enableRemoval: true });
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("checkbox", { name: "beklagte: Vertreter" }),
    );
    await user.click(screen.getByRole("button", { name: "Remove klagende" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(
      screen.getByRole("checkbox", { name: "beklagte: Vertreter" }),
    ).toBeChecked();
    const formData = new FormData(
      screen.getByRole("form", { name: "Formular" }) as HTMLFormElement,
    );
    expect(formData.get(`personen.${ids[1]}`)).toBe("off");
    expect(formData.get(`personen.${ids[3]}`)).toBe("on");
  });

  it("uses overview ordering and numbering for both klagende and beklagte, with representatives next to their party", async () => {
    const klagendeOrg = organisation("K-Org 1");
    const mixed = {
      klagenden: [
        klagendeOrg,
        naturalPerson("K-Person 1"),
        organisation("K-Org 2"),
        naturalPerson("K-Person 2"),
      ],
      beklagten: [organisation("B-Org"), naturalPerson("B-Person")],
    } satisfies GeldEinklagenAnwaltschaftUserData;

    renderForm({
      initialData: mixed,
      includeGesetzlicheVertretung: true,
      showIndex: true,
    });
    expect(
      screen
        .getAllByRole("checkbox")
        .map((element) =>
          element instanceof HTMLInputElement
            ? element.labels?.[0]?.textContent
            : undefined,
        ),
    ).toEqual([
      "klagende 1: K-Person 1",
      "klagende 1: K-Person 1 Vertretung",
      "klagende 2: K-Person 2",
      "klagende 2: K-Person 2 Vertretung",
      "klagende 3: K-Org 1",
      "klagende 3: K-Org 1 Hauptvertretung",
      "klagende 3: K-Org 1 weitere Vertretung",
      "klagende 4: K-Org 2",
      "klagende 4: K-Org 2 Hauptvertretung",
      "klagende 4: K-Org 2 weitere Vertretung",
      "beklagte 1: B-Person",
      "beklagte 1: B-Person Vertretung",
      "beklagte 2: B-Org",
      "beklagte 2: B-Org Hauptvertretung",
      "beklagte 2: B-Org weitere Vertretung",
    ]);
    await userEvent.setup().click(
      screen.getByRole("checkbox", {
        name: "klagende 3: K-Org 1 Hauptvertretung",
      }),
    );
    const formData = new FormData(
      screen.getByRole("form", { name: "Formular" }) as HTMLFormElement,
    );
    expect(formData.get(`personen.${klagendeOrg.orgVertretungId}`)).toBe("on");
    expect(formData.get(`personen.${klagendeOrg.id}`)).toBe("off");
    const submitted = Object.fromEntries(
      Array.from(formData.entries())
        .filter(([name]) => name.startsWith("personen."))
        .map(([name, value]) => [name.slice("personen.".length), value]),
    );
    expect(
      parteivernehmungSchema.shape.personen.safeParse(submitted).success,
    ).toBe(true);
  });

  it.each(["klagende", "beklagte"] as const)(
    "keeps overview numbering for %s without representatives",
    (relationship) => {
      const parties = [organisation("Org"), naturalPerson("Person")];
      renderForm({
        relationship,
        showIndex: true,
        initialData: { klagenden: parties, beklagten: parties },
      });
      expect(
        screen
          .getAllByRole("checkbox")
          .map((element) =>
            element instanceof HTMLInputElement
              ? element.labels?.[0]?.textContent
              : undefined,
          ),
      ).toEqual([`${relationship} 1: Person`, `${relationship} 2: Org`]);
    },
  );
});
