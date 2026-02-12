import { useState, useEffect } from "react";
import { Form, useNavigation } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import KernButton from "~/components/kern/KernButton";
import KernHeading from "~/components/kern/KernHeading";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { type StrapiContentComponent } from "~/services/cms/models/formElements/StrapiContentComponent";
import { type Translations } from "~/services/translations/getTranslationByKey";

type KernDatenschutzProps = {
  content: StrapiContentComponent[];
  trackingConsent: "true" | "false" | undefined;
  acceptCookiesFieldName: string;
  cookieTranslations: Translations;
};
export default function KernDatenschutz({
  content,
  trackingConsent,
  acceptCookiesFieldName,
  cookieTranslations,
}: KernDatenschutzProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    setSubmitButtonDisabled(trackingConsent === undefined);
  }, [trackingConsent]);

  return (
    <div className="flex flex-col grow">
      <ContentComponents content={content} showKernUX={true} />
      <GridSection>
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 3, span: 7 }}
            xlColumn={{ start: 3, span: 7 }}
            className="pb-80"
          >
            <Form
              method="post"
              className="flex flex-col gap-kern-space-x-large"
            >
              <KernHeading
                tagName="h2"
                text={cookieTranslations?.heading}
                elementId="cookieSetting"
                size="large"
              />

              <fieldset
                className="kern-fieldset pb-22!"
                disabled={isSubmitting}
                onChange={() => setSubmitButtonDisabled(false)}
              >
                <legend className="kern-label">Einverständnis</legend>
                <div className="kern-fieldset__body">
                  <div className="kern-form-check">
                    <input
                      type="radio"
                      className="kern-form-check__radio"
                      id="cookieTrue"
                      value="true"
                      name={acceptCookiesFieldName}
                      defaultChecked={trackingConsent === "true"}
                    />
                    <label className="kern-label" htmlFor="cookieTrue">
                      {cookieTranslations?.acceptLabel}
                    </label>
                  </div>
                  <div className="kern-form-check">
                    <input
                      type="radio"
                      className="kern-form-check__radio"
                      id="cookieFalse"
                      name={acceptCookiesFieldName}
                      value="false"
                      defaultChecked={trackingConsent === "false"}
                    />
                    <label className="kern-label" htmlFor="cookieFalse">
                      {cookieTranslations?.declineLabel}
                    </label>
                  </div>
                </div>
              </fieldset>
              <div>
                <KernButton
                  type="submit"
                  look="primary"
                  text="Speichern"
                  id="submitButton"
                  disabled={
                    isSubmitting ||
                    (submitButtonDisabled && trackingConsent === undefined)
                  }
                />
              </div>
            </Form>
          </GridItem>
        </Grid>
      </GridSection>
    </div>
  );
}
