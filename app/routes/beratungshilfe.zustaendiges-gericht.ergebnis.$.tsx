import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import Heading from "~/components/common/Heading";
import { StandaloneLink } from "~/components/common/StandaloneLink";
import ContentComponents from "~/components/content/ContentComponents";
import CourtDetails from "~/components/CourtDetails";
import Container from "~/components/layout/Container";
import { fetchPage } from "~/services/cms/index.server";
import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const [zipCode, streetSlug, houseNumber] = splat.split("/");
  if (edgeCasesForPlz(zipCode).length > 0 && !streetSlug) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/auswahl/${zipCode}`);
  }

  const court = findCourt({ zipCode, streetSlug, houseNumber });
  if (!court) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const slug = "/beratungshilfe/zustaendiges-gericht/ergebnis";
  const [{ content, pageMeta }] = await Promise.all([fetchPage(slug)]);
  return { court, content, meta: pageMeta };
};

export const Component = () => {
  const { court, content } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col grow bg-blue-100">
      <Container paddingTop="48" backgroundColor="blue">
        <span className="ds-label-03-reg">Amtsgericht finden</span>
        <Heading tagName="h1" look="ds-heading-02-reg" className="mt-16">
          Ihr zuständiges Amtsgericht
        </Heading>
      </Container>

      <Container backgroundColor="white" overhangingBackground>
        <CourtDetails
          name={court.BEZEICHNUNG}
          street={court.STR_HNR}
          city={`${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`}
          website={court.URL1}
          phone={court.TEL}
          addressLabel="Adresse"
          websiteLabel="Webseite"
          phoneLabel="Telefonnummer"
        />
      </Container>
      <Container>
        <StandaloneLink
          text="Suche wiederholen"
          url="/beratungshilfe/zustaendiges-gericht/suche"
        />
      </Container>
      <ContentComponents content={content} />
    </div>
  );
};

export default Component;
