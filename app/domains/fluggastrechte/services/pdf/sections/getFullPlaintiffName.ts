import capitalize from "lodash/capitalize";

export const getFullPlaintiffName = (
  anrede?: string,
  title?: "" | "dr",
  vorname?: string,
  nachname?: string,
) => {
  const mappedTitle = title === "dr" ? "Dr." : title;
  const capitalizedVorname = capitalize(vorname);

  return [anrede, mappedTitle, capitalizedVorname, nachname]
    .filter(Boolean)
    .join(" ");
};
