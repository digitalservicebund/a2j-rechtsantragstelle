// A person's display name, joined from the separate first-name / last-name
// fields ("Alle Vornamen" / "Alle Nachnamen"). Missing parts are dropped so a
// person with only one filled field still renders without a stray space.
export function personName(person: {
  vorname?: string;
  nachname?: string;
  geburtsname?: string;
}): string {
  const formattedGeburtsname = person.geburtsname
    ? `(${person.geburtsname})`
    : "";
  return [person.vorname, formattedGeburtsname, person.nachname]
    .filter(Boolean)
    .join(" ");
}
