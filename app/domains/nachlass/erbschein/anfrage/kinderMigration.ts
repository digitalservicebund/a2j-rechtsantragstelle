import { type BaseKind, type Kind } from "../shared/erbfolgeTypes";

const emptyDate = {
  day: "",
  month: "",
  year: "",
};

export const migrateKind = (kind: BaseKind): Kind => {
  if (kind.isAlive === "yes") {
    return {
      vorname: kind.vorname,
      nachname: kind.nachname,
      isAlive: "yes",
      geburtsdatum: emptyDate,
      geburtsort: "",
      strasse: "",
      hausnummer: "",
      plz: "",
      ort: "",
      land: "",
    };
  }

  const baseDeceasedKind = {
    vorname: kind.vorname,
    nachname: kind.nachname,
    isAlive: "no" as const,
    geburtsdatum: emptyDate,
    geburtsort: "",
    sterbedatum: emptyDate,
    sterbeort: "",
  };

  if ("kinder" in kind) {
    return {
      ...baseDeceasedKind,
      hatteKinder: "yes",
      kinder: kind.kinder?.map(migrateKind),
    };
  }

  return {
    ...baseDeceasedKind,
    hatteKinder: kind.hatteKinder,
  };
};
