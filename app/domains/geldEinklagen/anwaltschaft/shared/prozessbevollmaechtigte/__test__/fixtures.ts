import { type Prozessbevollmaechtigte } from "../prozessbevollmaechtigteSchemas";

const address = {
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Musterstadt",
  land: "Deutschland",
};

export const einzelkanzlei = {
  ...address,
  id: "c07b7431-7f38-47f3-904a-a71ca0833d92",
  name: "Super Kanzlei",
  geschaeftszeichen: "EK-123",
  telefonnummer: "+49 30 123456",
  email: "kanzlei@example.com",
  berufsbezeichnung: "Rechtsanwältin",
  type: "einzelkanzlei",
  anrede: "frau",
  titel: "",
  vorname: "Erika",
  nachname: "Musterfrau",
} satisfies Prozessbevollmaechtigte[number];

export const gesellschaft = {
  ...address,
  id: "b976d872-2c58-46d4-b043-1bd714ae866c",
  type: "berufsausuebungsgesellschaft",
  name: "Musterkanzlei PartG",
  geschaeftszeichen: "BAG-123",
  telefonnummer: "+49 30 654321",
  email: "gesellschaft@example.com",
  isProzessbevollmaechtigt: "on",
} satisfies Prozessbevollmaechtigte[number];

export const unrelatedParty = {
  ...einzelkanzlei,
  type: "natuerliche-person",
  parteiverhaeltnis: "klagende",
  vorname: "Wrong party data",
} as const;
