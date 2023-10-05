import {
  fillOutBeratungshilfe,
  getBeratungshilfeParameters,
} from "~/services/pdf/beratungshilfe/beratungshilfe.server";

export const loader = async () => {
  const parameters = await getBeratungshilfeParameters();

  if (
    parameters?.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers
  ) {
    parameters.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value =
      "Teststraße 1";
  }
  if (parameters?.antragstellerNameVornameggfGeburtsname) {
    parameters.antragstellerNameVornameggfGeburtsname.value = "Christian";
  }
  if (parameters?.bew) {
    parameters.bew.value = true;
  }

  return new Response(await fillOutBeratungshilfe(parameters), {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
