import capitalize from "lodash/capitalize";

const mapTitle = (title?: "none" | "dr") => {
  if (title === "dr") {
    return "Dr.";
  }

  if (title === "none") {
    return "";
  }

  return title;
};

export const getFullPlaintiffName = (
  anrede?: string,
  title?: "none" | "dr",
  vorname?: string,
  nachname?: string,
) => {
  const mappedTitle = mapTitle(title);
  const salutation = anrede === "none" ? "" : capitalize(anrede);
  const capitalizedVorname = capitalize(vorname);

  return [salutation, mappedTitle, capitalizedVorname, nachname]
    .filter(Boolean)
    .join(" ");
};
