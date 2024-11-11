import capitalize from "lodash/capitalize";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";

export const getFullPlaintiffName = (userData: FluggastrechtContext) => {
  const { anrede, title, vorname, nachname } = userData;

  const mappedTitle = title === "dr" ? "Dr." : title;
  const capitalizedVorname = capitalize(vorname);

  return [anrede, mappedTitle, capitalizedVorname, nachname]
    .filter(Boolean)
    .join(" ");
};
