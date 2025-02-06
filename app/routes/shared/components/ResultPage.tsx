import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import { useLoaderData } from "@remix-run/react";
import { type ReactElement } from "react";
import type { BackgroundColor } from "~/components";
import Background from "~/components/Background";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import PageContent from "~/components/PageContent";
import RichText from "~/components/RichText";
import type { loader } from "~/routes/shared/result.server";
import { keyFromElement } from "~/services/cms/keyFromElement";
import { StrapiContentComponent } from "~/services/cms/models/StrapiContentComponent";
import type { StrapiResultPageType } from "~/services/cms/models/StrapiResultPageType";

const iconCSS = "inline-block !h-[36px] !w-[36px] !min-h-[36px] !min-w-[36px]";
const icons: Record<StrapiResultPageType, ReactElement> = {
  error: <HighlightOff color="error" className={iconCSS} />,
  success: <CheckCircleOutline color="success" className={iconCSS} />,
  warning: <WarningAmber color="warning" className={iconCSS} />,
  info: <CheckCircleOutline color="success" className={iconCSS} />,
};

const backgrounds: Record<StrapiResultPageType, BackgroundColor> = {
  error: "red",
  success: "green",
  warning: "yellow",
  info: "blue",
};

export function ResultPage() {
  const { common, cmsData, backButton } = useLoaderData<typeof loader>();
  const documentsList = cmsData.documents;
  const nextSteps = cmsData.nextSteps;
  const content = cmsData.freeZone;

  return (
    <>
      <Background backgroundColor="blue" paddingTop="40" paddingBottom="48">
        <div className={backgrounds[cmsData.pageType]}>
          <Container
            overhangingBackground
            backgroundColor={backgrounds[cmsData.pageType]}
            paddingTop="32"
            paddingBottom="40"
          >
            <div className="flex sm:flex-row flex-col gap-16">
              {icons[cmsData.pageType]}
              <div className="flex flex-col gap-16">
                <Heading
                  tagName={cmsData.heading.tagName}
                  look={cmsData.heading.look}
                  className="flex items-center mb-0"
                >
                  {cmsData.heading.text}
                </Heading>

                {cmsData.hintText && <RichText html={cmsData.hintText.text} />}
              </div>
            </div>
          </Container>

          <Container paddingTop="48" paddingBottom="0">
            <ButtonContainer>
              {backButton.destination && (
                <a className="text-link" href={backButton.destination}>
                  {backButton.label}
                </a>
              )}
              {cmsData.nextLink?.url && (
                <a className="text-link" href={cmsData.nextLink.url}>
                  {cmsData.nextLink.text ?? common.nextButtonDefaultLabel}
                </a>
              )}
            </ButtonContainer>
          </Container>
        </div>
      </Background>

      {content.length > 0 && (
        <PageContent content={content as StrapiContentComponent[]} />
      )}

      {documentsList.length > 0 && (
        <div>
          {documentsList.map((element) => (
            <PageContent
              key={keyFromElement(element as StrapiContentComponent)}
              content={[element as StrapiContentComponent]}
            />
          ))}
        </div>
      )}

      <div className={`${documentsList.length > 0 ? "bg-blue-100" : ""}`}>
        <PageContent content={nextSteps as StrapiContentComponent[]} />
      </div>
    </>
  );
}
