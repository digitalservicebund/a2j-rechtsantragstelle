import FileDownloadIcon from "@digitalservicebund/icons/FileDownload";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import Background from "~/components/Background";
import Button from "~/components/Button";
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
    shouldPrint,
  } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (shouldPrint) {
      window.print();
      window.close();
    }
  }, [shouldPrint]);

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container paddingTop="24" paddingBottom="64">
          <div className="ds-stack ds-stack-16">
            <ProgressBar {...progressProps} />
            <div className="ds-stack ds-stack-40">
              <PageContent
                content={contentElements}
                className="ds-stack ds-stack-16"
                fullScreen={false}
              />
              <Button
                iconLeft={<FileDownloadIcon />}
                text="Anleitung Herunterladen"
                size="large"
                href="/kontopfaendung/wegweiser/sozialleistungen-einmalzahlung?print"
              />
              <ValidatedFlowForm
                stepData={stepData}
                csrf={csrf}
                formElements={formElements}
                buttonNavigationProps={buttonNavigationProps}
              />
            </div>
          </div>
        </Container>
      </div>
    </Background>
  );
}
