import {
  BaseElternteil,
  BaseElternteilKind,
  Elternteil,
  ElternteilKind,
  type BaseKind,
  type Kind,
} from "../shared/erbfolgeTypes";

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
const migrateElternteilKind = (kind: BaseElternteilKind): ElternteilKind => {
  if (kind.isAlive === "yes") {
    return {
      vorname: kind.vorname,
      nachname: kind.nachname,
      isAlive: "yes",
      parentElternteilIndex: kind.parentElternteilIndex,
      parentKindIndex: kind.parentKindIndex,
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
    parentElternteilIndex: kind.parentElternteilIndex,
    parentKindIndex: kind.parentKindIndex,
    geburtsdatum: emptyDate,
    geburtsort: "",
    sterbedatum: emptyDate,
    sterbeort: "",
  };
  if ("kinder" in kind) {
    return {
      ...baseDeceasedKind,
      hatteKinder: "yes",
      kinder: kind.kinder?.map(migrateElternteil),
    };
  }

  return {
    ...baseDeceasedKind,
    hatteKinder: kind.hatteKinder,
  };
};
export const migrateElternteil = (elternteil: BaseElternteil): Elternteil => {
  if (elternteil.isAlive === "yes") {
    return {
      vorname: elternteil.vorname,
      nachname: elternteil.nachname,
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

  const baseDeceasedElternteil = {
    vorname: elternteil.vorname,
    nachname: elternteil.nachname,
    isAlive: "no" as const,
    geburtsdatum: emptyDate,
    geburtsort: "",
    sterbedatum: emptyDate,
    sterbeort: "",
  };

  if ("kinder" in elternteil) {
    return {
      ...baseDeceasedElternteil,
      hatteKinder: "yes",
      kinder: elternteil.kinder?.map(migrateElternteilKind),
    };
  }

  return {
    ...baseDeceasedElternteil,
    hatteKinder: elternteil.hatteKinder,
  };
};
