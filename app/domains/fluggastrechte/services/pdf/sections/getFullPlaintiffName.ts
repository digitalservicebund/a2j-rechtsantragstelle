import capitalize from "lodash/capitalize";
import { uppercaseFirstLetter } from "~/util/strings";

export const getFullPlaintiffName = (
  anrede?: string,
  title?: "" | "dr",
  vorname?: string,
  nachname?: string,
) => {
  const mappedTitle = title === "dr" ? "Dr." : title;
  const salutation = anrede !== "none" ? uppercaseFirstLetter(anrede) : "";
  const capitalizedVorname = capitalize(vorname);

  return [salutation, mappedTitle, capitalizedVorname, nachname]
    .filter(Boolean)
    .join(" ");
};
