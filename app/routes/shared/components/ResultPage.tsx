import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import { type ReactElement } from "react";
import { useLoaderData } from "react-router";
import { GridContainer, GridItem, type BackgroundColor } from "~/components";
import Background from "~/components/Background";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import ContentComponents from "~/components/ContentComponents";
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
    <>
      <GridContainer
        columns={12}
        maxWidth="xl"
        alignItems="start"
        paddingX="sm"
        paddingY="xl"
        justifyContent="start"
        className="bg-blue-100"
      >
        <GridItem
          span={12}
          colStart={1}
          className="bg-yellow-300 rounded-lg p-32"
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
        </GridItem>
        <GridItem span={12} colStart={1}>
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
        </GridItem>
      </GridContainer>

      <GridContainer
        columns={12}
        maxWidth="xl"
        alignItems="start"
        paddingX="sm"
        justifyContent="start"
      >
        <GridItem span={12} colStart={1}>
          {content.length > 0 && <ContentComponents content={content} />}
        </GridItem>

        {documentsList.length > 0 && (
          <GridItem span={12} colStart={1}>
            {documentsList.map((element) => (
              <ContentComponents
                key={`${element.__component}_${element.id}`}
                content={[element]}
              />
            ))}
          </GridItem>
        )}

        <GridItem
          span={12}
          colStart={1}
          className={`${documentsList.length > 0 ? "bg-blue-100" : ""}`}
        >
          <ContentComponents content={nextSteps} />
        </GridItem>
      </GridContainer>
    </>
  );
}
