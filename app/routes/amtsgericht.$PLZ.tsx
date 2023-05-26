import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  gerbehIndex,
  isKeyOfObject,
} from "~/services/gerichtsfinder/convert_json";
import type {
  Jmtd14VTErwerberGerbeh,
  Jmtd14VTErwerberPlzstrn,
  Jmtd14VTErwerberPlzortk,
} from "~/services/gerichtsfinder/types";
import gerbeh from "~/services/gerichtsfinder/_data/JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json";
import plzortk from "~/services/gerichtsfinder/_data/JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json";
import plzstrn from "~/services/gerichtsfinder/_data/JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json";
import { Container } from "~/components";
import Header from "~/components/Header";

interface Response {
  court?: Jmtd14VTErwerberGerbeh;
  edgeCases: {
    edgeCase: Jmtd14VTErwerberPlzstrn;
    court?: Jmtd14VTErwerberGerbeh;
  }[];
}

const response: Response = {
  court: undefined,
  edgeCases: [],
};

function stripLeadingZeros(s: string) {
  return s.replace(/^0+/, "");
}

export const loader = async ({ params }: LoaderArgs) => {
  const { PLZ } = params;

  // If PLZ missing or not in dataset: return empty
  if (!PLZ || !isKeyOfObject(PLZ, plzortk)) {
    return json(response);
  }

  // Extract matching Amtsgericht address
  const defaultAmtsgericht = plzortk[PLZ][0] as Jmtd14VTErwerberPlzortk;
  const defaultGerbehIndex = gerbehIndex(
    defaultAmtsgericht.GERBEH_LKZ,
    defaultAmtsgericht.GERBEH_OLG,
    defaultAmtsgericht.GERBEH_LG,
    defaultAmtsgericht.GERBEH_AG,
    defaultAmtsgericht.GERBEH_TYP_INFO
  );
  if (isKeyOfObject(defaultGerbehIndex, gerbeh)) {
    response.court = gerbeh[defaultGerbehIndex] as Jmtd14VTErwerberGerbeh;
  }

  // Check whether edge cases exist
  const edgeCases = (
    isKeyOfObject(PLZ, plzstrn) ? plzstrn[PLZ] : []
  ) as Jmtd14VTErwerberPlzstrn[];

  // If so: return all edge case details and corresponding Amtsgericht
  response.edgeCases = edgeCases.map((edgeCase) => {
    const ausnahmeGerbehIndex = gerbehIndex(
      edgeCase.LKZ,
      edgeCase.OLG,
      edgeCase.LG,
      edgeCase.AG,
      edgeCase.TYP_INFO
    );
    const court = isKeyOfObject(ausnahmeGerbehIndex, gerbeh)
      ? (gerbeh[ausnahmeGerbehIndex] as Jmtd14VTErwerberGerbeh)
      : undefined;

    return { edgeCase, court };
  });

  return json(response);
};

export default function () {
  const { court: amtsgericht, edgeCases } = useLoaderData<typeof loader>();
  if (!amtsgericht) {
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
          text: amtsgericht.BEZEICHNUNG,
        }}
      />
      <div>
        {amtsgericht.STR_HNR}
        <br />
        {amtsgericht.PLZ_ZUSTELLBEZIRK} {amtsgericht.ORT}
        <br />
        Telefon: {amtsgericht.TEL}
        <br />
        Telefax: {amtsgericht.FAX}
        <br />
        {amtsgericht.EMAIL1 && `Email: ${amtsgericht.EMAIL1}`}
        <br />
        Webseite: {amtsgericht.URL1}
        <br />
        <br />
        <h2>Ausnahmen:</h2>
        <ul>
          {edgeCases.map((edgeCase, idx) => (
            <li key={idx}>
              <div>
                {`${edgeCase.edgeCase.STRN}, ${
                  edgeCase.edgeCase.HNR_MERKMAL_INFO
                } ${stripLeadingZeros(
                  edgeCase.edgeCase.HNR_VON
                )} - ${stripLeadingZeros(edgeCase.edgeCase.HNR_BIS)}`}
                <br />
                {edgeCase.court &&
                  `${edgeCase.court.BEZEICHNUNG}, ${edgeCase.court.STR_HNR}, ${edgeCase.court.PLZ_ZUSTELLBEZIRK} ${edgeCase.court.ORT}`}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
