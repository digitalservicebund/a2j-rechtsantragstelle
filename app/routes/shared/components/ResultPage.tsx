import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import { useLoaderData } from "react-router";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading from "~/components/common/Heading";
import RichText from "~/components/common/RichText";
import ContentComponents from "~/components/content/ContentComponents";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import Background from "~/components/layout/Background";
import Container from "~/components/layout/Container";
import { type loader } from "../result";

const iconProps = {
  "aria-hidden": false,
  className: "inline-block h-[36px]! w-[36px]! min-h-[36px]! min-w-[36px]!",
};

const boxProps = {
  error: {
    backgroundColor: "red",
    icon: <HighlightOff aria-label="Negatives Ergebnis" {...iconProps} />,
  },
  success: {
    backgroundColor: "green",
    icon: <CheckCircleOutline aria-label="Positives Ergebnis" {...iconProps} />,
  },
  warning: {
    backgroundColor: "yellow",
    icon: <WarningAmber aria-label="Warnung" {...iconProps} />,
  },
  info: {
    backgroundColor: "blue",
    icon: <CheckCircleOutline aria-label="Information" {...iconProps} />,
  },
} as const;

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
      <Background
        backgroundColor="blue"
        paddingTop="40"
        paddingBottom="48"
        className="print:hidden"
      >
        <Container
          overhangingBackground
          backgroundColor={boxProps[cmsData.pageType].backgroundColor}
          paddingTop="32"
          paddingBottom="40"
        >
          <div className="flex sm:flex-row flex-col gap-16">
            {boxProps[cmsData.pageType].icon}
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
