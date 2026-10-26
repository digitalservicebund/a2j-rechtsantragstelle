import { render, screen } from "@testing-library/react";
import KlagePartei from "~/domains/geldEinklagen/anwaltschaft/shared/components/KlagePartei";
import { type KlageParteien } from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { translations } from "~/services/translations/translations";

const organisation = {
  parteiverhaeltnis: "klagende",
  type: "organisation",
  orgName: "Beispiel GmbH",
  orgVertretungArt: "vorstand-vorstaendin",
  orgVertretungAnrede: "none",
  orgVertretungTitel: "",
  orgVertretungVorname: "Erika",
  orgVertretungNachname: "Musterfrau",
  strasse: "Beispielstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Beispielstadt",
  land: "Deutschland",
} satisfies KlageParteien[number];

describe("KlagePartei", () => {
  it("always includes the legal-representation deletion text for organisations", () => {
    render(
      <KlagePartei
        partei={organisation}
        index={0}
        displayIndex={0}
        relationship="klagende"
      />,
    );

    const expectedLabel = [
      `${translations.geldEinklagenAnwaltschaft.klagendeParteiHeadline.de} 1)`,
      translations.geldEinklagenAnwaltschaft.gesetzlicheVertretungDeletionLabel
        .de,
      translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase(),
    ].join(" ");

    expect(
      screen.getByRole("link", { name: expectedLabel }),
    ).toBeInTheDocument();
  });
});
