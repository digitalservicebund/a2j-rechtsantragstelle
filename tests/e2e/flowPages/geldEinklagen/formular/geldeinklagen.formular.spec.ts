import { test, expect } from "@playwright/test";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";
import { GeldEinklagenFormular } from "tests/e2e/pom/GeldEinklagenFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

let geldEinklagenFormular: GeldEinklagenFormular;

test.beforeEach(async ({ page }) => {
  geldEinklagenFormular = new GeldEinklagenFormular(page);
  await geldEinklagenFormular.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test("forwarded to intial step", async ({ page }) => {
  await expect(page).toHaveURL(
    new RegExp(
      `.+${geldEinklagenFormular.url}/${geldEinklagenFormular.initialStep}$`,
    ),
  );
});

test("geldeinklagen formular can be traversed for privatperson", async ({
  page,
}) => {
  // /geld-einklagen/formular/start
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/dokumente
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/daten-uebernahme
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/persoenliche-daten/start
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/persoenliche-daten/anzahl
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillDropdownPage("anzahl", "1");

  // /geld-einklagen/formular/persoenliche-daten/name
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillDropdown("title", "");
  await geldEinklagenFormular.fillInput("nachname", "Donatello");
  await geldEinklagenFormular.fillInput("vorname", "Cowabunga");
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/persoenliche-daten/volljaehrig
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillRadioPage("volljaehrig", "yes");

  // /geld-einklagen/formular/persoenliche-daten/adresse
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillInput(
    "strasseHausnummer",
    "Schildkrötenstraße 5",
  );
  await geldEinklagenFormular.fillInput("plz", "10119");
  await geldEinklagenFormular.fillInput("ort", "Mutant Mayhem");
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/persoenliche-daten/telefonnummer
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillInputPage("telefonnummer", "015111225588");

  // /geld-einklagen/formular/persoenliche-daten/gesetzliche-vertretung
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillRadioPage("gesetzlicheVertretung", "no");

  // /geld-einklagen/formular/persoenliche-daten/bevollmaechtigte-person
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillRadioPage("bevollmaechtigtePerson", "no");

  // /geld-einklagen/formular/gegenseite/start
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/gegenseite/typ
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillRadioPage("gegenseite.typ", "privatperson");

  // /geld-einklagen/formular/gegenseite/privatperson-name
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillDropdown("gegenseite.privatperson.title", "");
  await geldEinklagenFormular.fillInput(
    "gegenseite.privatperson.nachname",
    "Michelangelo",
  );
  await geldEinklagenFormular.fillInput(
    "gegenseite.privatperson.vorname",
    "Cowabunga",
  );
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/gegenseite/privatperson-adresse
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillInput(
    "gegenseite.privatperson.strasseHausnummer",
    "Schildkrötenstraße 6",
  );
  await geldEinklagenFormular.fillInput("gegenseite.privatperson.plz", "10115");
  await geldEinklagenFormular.fillInput(
    "gegenseite.privatperson.ort",
    "Mutant City",
  );
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/gegenseite/privatperson-kontakt
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillInputPage(
    "gegenseite.privatperson.telefonnummer",
    "0123456789",
  );

  // /geld-einklagen/formular/gegenseite/privatperson-bevollmaechtigte-person
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillRadioPage(
    "gegenseite.privatperson.bevollmaechtigtePerson",
    "no",
  );

  // /geld-einklagen/formular/forderung/start
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/forderung/gegenseite
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillInput("forderung.forderung1.betrag", "123");
  await geldEinklagenFormular.fillInput("forderung.forderung1.title", "123");
  await geldEinklagenFormular.fillInput("forderung.forderung2.betrag", "123");
  await geldEinklagenFormular.fillInput("forderung.forderung2.title", "123");
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/forderung/forderung-1-beschreibung
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillTextareaPage(
    "forderung.forderung1.beschreibung",
    "I want pizza!",
  );

  // /geld-einklagen/formular/forderung/forderung-1-beweise
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/forderung/forderung-1-zeugen
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillDropdown(
    "forderung.forderung1.zeuge.title",
    "",
  );
  await geldEinklagenFormular.fillInput(
    "forderung.forderung1.zeuge.nachname",
    "Raphael",
  );
  await geldEinklagenFormular.fillInput(
    "forderung.forderung1.zeuge.vorname",
    "Cowabunga",
  );
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/forderung/person-1-adresse
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillInput(
    "forderung.forderung1.person.strasseHausnummer",
    "Schildkrötenstraße 7",
  );
  await geldEinklagenFormular.fillInput(
    "forderung.forderung1.person.plz",
    "10117",
  );
  await geldEinklagenFormular.fillInput(
    "forderung.forderung1.person.ort",
    "Mutant Village",
  );
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/forderung/person-1-kontakt
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillInput(
    "forderung.forderung1.person.telefonnummer",
    "0123456789",
  );
  // await geldEinklagenFormular.fillInput(
  //   "forderung.forderung1.person.email",
  //   "raphael@mutantturtles.com",
  // );
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/forderung/forderung-2-beschreibung
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillTextareaPage(
    "forderung.forderung2.beschreibung",
    "Gimme more pizza!",
  );

  // /geld-einklagen/formular/forderung/nebenforderungen
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillRadioPage("forderung.nebenforderungen", "no");

  // /geld-einklagen/formular/forderung/kosten
  await expectPageToBeAccessible({ page });
  await expect(
    page.getByRole("paragraph").filter({
      hasText: "246",
    }),
  ).toHaveCount(1);
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/versaeumnisurteil
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillRadioPage("versaeumnisurteil", "no");

  // /geld-einklagen/formular/anmerkung
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.fillTextareaPage("anmerkung", "Get some pizza!");

  // /geld-einklagen/formular/ueberpruefung
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/aenderungMitteilung
  await expectPageToBeAccessible({ page });
  await geldEinklagenFormular.clickLabelFor("aenderungMitteilung");
  await geldEinklagenFormular.clickNext();

  // /geld-einklagen/formular/einverstaendnis
  await expectPageToBeAccessible({ page });
  await expect(
    page.getByRole("heading").filter({
      hasText:
        "Prüfen Sie Ihre Angaben und versenden Sie die Klage an das zuständige Amtsgericht",
    }),
  ).toHaveCount(1);
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${geldEinklagenFormular.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(
      `.+${geldEinklagenFormular.url}/${geldEinklagenFormular.initialStep}$`,
    ),
  );
});
