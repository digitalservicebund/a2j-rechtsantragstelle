import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import { type ReactElement } from "react";
import { useLoaderData } from "react-router";
import type { BackgroundColor } from "~/components";
import Background from "~/components/common/Background";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import ContentComponents from "~/components/content/ContentComponents";
import Heading from "~/components/Heading";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import RichText from "~/components/RichText";
import type { StrapiResultPageType } from "~/services/cms/models/StrapiResultPageType";
import { type loader } from "../result";

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
  const {
    cmsData,
    buttonNavigationProps: { back, next },
  } = useLoaderData<typeof loader>();
  const documentsList = cmsData.documents;
  const nextSteps = cmsData.nextSteps;
  const content = cmsData.freeZone;

  useFocusFirstH1();

  return (
    <div className="flex flex-col min-w-full">
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
              <div className="flex flex-col gap-16" id="flow-page-content">
                <Heading
                  tagName={cmsData.heading.tagName}
                  look={cmsData.heading.look}
                  className="flex items-center mb-0"
                >
                  {cmsData.heading.text}
                </Heading>

                {cmsData.hintText && <RichText html={cmsData.hintText.html} />}
              </div>
            </div>
          </Container>

          <Container paddingTop="48" paddingBottom="0">
            <ButtonContainer>
              {back.destination && (
                <a className="text-link" href={back.destination}>
                  {back.label}
                </a>
              )}
              {cmsData.nextLink?.url && (
                <a className="text-link" href={cmsData.nextLink.url}>
                  {next?.label}
                </a>
              )}
            </ButtonContainer>
          </Container>
        </div>
      </Background>

      {content.length > 0 && <ContentComponents content={content} />}

      {documentsList.length > 0 && (
        <div>
          {documentsList.map((element) => (
            <ContentComponents
              key={`${element.__component}_${element.id}`}
              content={[element]}
            />
          ))}
        </div>
      )}

      <div className={`${documentsList.length > 0 ? "bg-blue-100" : ""}`}>
        <ContentComponents content={nextSteps} />
      </div>
    </div>
  );
}
