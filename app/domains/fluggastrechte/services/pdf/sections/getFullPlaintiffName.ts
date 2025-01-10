import capitalize from "lodash/capitalize";

export const getFullPlaintiffName = (
  anrede?: string,
  title?: "" | "dr",
  vorname?: string,
  nachname?: string,
) => {
  const mappedTitle = title === "dr" ? "Dr." : title;
  const salutation = anrede !== "none" ? capitalize(anrede) : "";
  const capitalizedVorname = capitalize(vorname);

  return [salutation, mappedTitle, capitalizedVorname, nachname]
    .filter(Boolean)
    .join(" ");
};
