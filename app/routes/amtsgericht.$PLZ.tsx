import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container } from "~/components";
import Header from "~/components/Header";
import { stripLeadingZeros } from "~/lib/strings";
import {
  edgeCasesForPlz,
  courtAddress,
  courtForPlz,
} from "~/services/gerichtsfinder/amtsgerichtData.server";

export const loader = async ({ params }: LoaderArgs) => {
  const { PLZ } = params;
  const amtsgerichtDefault = courtForPlz(PLZ);
  if (!amtsgerichtDefault) {
    return json({
      court: undefined,
      edgeCases: [],
    });
  }

  return json({
    court: courtAddress({
      LKZ: amtsgerichtDefault.GERBEH_LKZ,
      OLG: amtsgerichtDefault.GERBEH_OLG,
      LG: amtsgerichtDefault.GERBEH_LG,
      AG: amtsgerichtDefault.GERBEH_AG,
      typInfo: amtsgerichtDefault.GERBEH_TYP_INFO,
    }),
    edgeCases: edgeCasesForPlz(PLZ),
  });
};

export default function () {
  const { court, edgeCases } = useLoaderData<typeof loader>();
  if (!court) {
    return <div>Kein passendes Amtsgericht gefunden. PLZ überprüfen?</div>;
  }

  return (
    <Container>
      <Header
        heading={{
          text: "Zuständiges Gericht",
          tagName: "h2",
          look: "ds-heading-02-reg",
        }}
        content={{
          text: court.BEZEICHNUNG,
        }}
      />
      <div>
        {court.STR_HNR}
        <br />
        {court.PLZ_ZUSTELLBEZIRK} {court.ORT}
        <br />
        Telefon: {court.TEL}
        <br />
        Telefax: {court.FAX}
        <br />
        {court.EMAIL1 && `Email: ${court.EMAIL1}`}
        <br />
        Webseite: {court.URL1}
        <br />
        <br />
        <h2>Ausnahmen:</h2>
        <ul>
          {edgeCases.map(({ edgeCase, court }) => (
            <li
              key={`${edgeCase.STRN}_${edgeCase.HNR_VON}_${edgeCase.HNR_BIS}`}
            >
              <div>
                {`${edgeCase.STRN}, ${
                  edgeCase.HNR_MERKMAL_INFO
                } ${stripLeadingZeros(edgeCase.HNR_VON)} - ${stripLeadingZeros(
                  edgeCase.HNR_BIS
                )}`}
                <br />
                {court &&
                  `${court.BEZEICHNUNG}, ${court.STR_HNR}, ${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
