import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import { ProgressBar } from "~/components/form/ProgressBar";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import PageContent from "~/components/PageContent";
import type { loader } from "../vorabcheck.server";

export function VorabcheckPage() {
  const {
    csrf,
    stepData,
    contentElements,
    formElements,
    progressProps,
    buttonNavigationProps,
  } = useLoaderData<typeof loader>();
  return (
    <Container paddingTop="24" paddingBottom="64" backgroundColor="blue">
      <div className="min-h-screen ds-stack ds-stack-40">
        <ProgressBar {...progressProps} />
        <PageContent
          content={contentElements}
          className="ds-stack ds-stack-16"
          fullScreen={false}
        />
        <ValidatedFlowForm
          stepData={stepData}
          csrf={csrf}
          formElements={formElements}
          buttonNavigationProps={buttonNavigationProps}
        />
      </div>
    </Container>
  );
}
