import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ReactElement } from "react";
import Background from "~/components/Background";
import Container from "~/components/Container";
import CourtDetails from "~/components/CourtDetails";
import Heading from "~/components/Heading";
import PageContent from "~/components/PageContent";
import RichText from "~/components/RichText";
import { parsePathname } from "~/flows/flowIds";
import type { GeldEinklagenVorabcheckContext } from "~/flows/geldEinklagenVorabcheck/context";
import { fetchFlowPage, fetchTranslations } from "~/services/cms/index.server";
import {
  findCourt,
  isPartnerCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { splatFromParams } from "~/services/params";
import { getSessionManager } from "~/services/session.server";

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");
  const sessionManager = getSessionManager(flowId);
  const { data, id } = await sessionManager.getSession(cookieHeader);
  context.debugId = sessionManager.getDebugId(id); // For showing in errors

  const contextData = data as GeldEinklagenVorabcheckContext;
  const zipCodes = [
    contextData.schadenPlz,
    contextData.wohnraumPlz,
    contextData.ortLeistungPlz,
    contextData.gegenseitePersonPlz,
    contextData.gegenseiteUnternehmenPlz,
  ];
  const pageType = splatFromParams(params);

  const courts: Jmtd14VTErwerberGerbeh[] = [];
  zipCodes
    .filter((value, index, array) => array.indexOf(value) === index)
    .forEach((zipCode) => {
      if (zipCode) {
        const court = findCourt({ zipCode });
        if (
          court &&
          (isPartnerCourt(court.PLZ_ZUSTELLBEZIRK) || pageType == "negativ")
        ) {
          courts.push(court);
        }
      }
    });

  const [common, { heading, freeZone, hintText, meta }] = await Promise.all([
    fetchTranslations("amtsgericht"),
    fetchFlowPage("result-pages", pathname),
  ]);

  return json({ courts, freeZone, heading, hintText, pageType, meta, common });
};

const iconCSS = "inline-block mr-8 !h-[36px] !w-[36px]";
const icons: Record<"negativ" | "positiv", ReactElement> = {
  negativ: (
    <HighlightOff color="error" className={`${iconCSS} !text-red-900`} />
  ),
  positiv: (
    <CheckCircleOutline
      color="success"
      className={`${iconCSS} !text-green-900`}
    />
  ),
};

export const Component = () => {
  const { courts, freeZone, heading, hintText, pageType, common } =
    useLoaderData<typeof loader>();
  const background = pageType == "positiv" ? "green" : "red";

  return (
    <>
      <Background backgroundColor={background}>
        <Container paddingTop="24" paddingBottom="40" overhangingBackground>
          <Heading
            tagName={heading.tagName}
            look={heading.look}
            className="flex items-center mb-24"
          >
            {icons[pageType == "positiv" ? "positiv" : "negativ"]}
            {heading.text}
          </Heading>
          {hintText && (
            <Container
              backgroundColor="white"
              paddingTop="32"
              paddingBottom="40"
              overhangingBackground
            >
              <div className="ds-stack-8">
                <RichText markdown={hintText.text} />
              </div>
            </Container>
          )}
        </Container>
      </Background>
      <Background paddingBottom="48" paddingTop="48" backgroundColor="blue">
        {courts.map((court) => (
          <Container
            paddingTop="24"
            backgroundColor="white"
            overhangingBackground
            key={court.BEZEICHNUNG}
          >
            <CourtDetails
              name={court.BEZEICHNUNG}
              street={court.STR_HNR}
              city={`${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`}
              website={court.URL1}
              phone={court.TEL}
              addressLabel={common.resultAddress}
              websiteLabel={common.resultWebsite}
              phoneLabel={common.resultPhone}
            />
          </Container>
        ))}
      </Background>
      <PageContent content={freeZone} />
    </>
  );
};

export default Component;
