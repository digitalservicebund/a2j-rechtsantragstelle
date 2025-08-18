import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import type { ReactElement } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import Background from "~/components/common/Background";
import Container from "~/components/layout/Container";
import ContentComponents from "~/components/content/ContentComponents";
import CourtDetails from "~/components/CourtDetails";
import Heading from "~/components/common/Heading";
import RichText from "~/components/common/RichText";
import { parsePathname } from "~/domains/flowIds";
import type { GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";
import { fetchFlowPage, fetchTranslations } from "~/services/cms/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";
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
  await throw404IfFeatureFlagDisabled("showGeldEinklagenFlow");
  const { pathname } = new URL(request.url);
  const { flowId, stepId } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");
  const sessionManager = getSessionManager(flowId);
  const { data, id } = await sessionManager.getSession(cookieHeader);
  context.debugId = sessionManager.getDebugId(id); // For showing in errors

  const userData = data as GeldEinklagenVorabcheckUserData;
  const zipCodes = [
    userData.schadenPlz,
    userData.wohnraumPlz,
    userData.ortLeistungPlz,
    userData.gegenseitePersonPlz,
    userData.gegenseiteUnternehmenPlz,
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

  const [common, { heading, freeZone, hintText, pageMeta }] = await Promise.all(
    [
      fetchTranslations("amtsgericht"),
      fetchFlowPage("result-pages", flowId, stepId),
    ],
  );

  return {
    courts,
    freeZone,
    heading,
    hintText,
    pageType,
    meta: pageMeta,
    common,
  };
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
              <div className="ds-stack ds-stack-8">
                <RichText html={hintText.html} />
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
      <ContentComponents content={freeZone} />
    </>
  );
};

export default Component;
