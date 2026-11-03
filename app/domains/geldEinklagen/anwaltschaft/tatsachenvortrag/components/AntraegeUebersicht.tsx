import classNames from "classnames";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { getAbsaetzeBaseUrl } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

export const AntraegeUebersicht = () => {
  const { userData, flowId } = useFormFlow();
  const userDataGeldEinklagenAnwaltschaft =
    userData as GeldEinklagenAnwaltschaftUserData;
  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }
  return (
    <div>
      {userDataGeldEinklagenAnwaltschaft.hauptantrag?.map((antrag, index) => (
        <div
          // oxlint-disable-next-line react/no-array-index-key
          key={`index-${index}`}
          className={classNames(
            "flex justify-between items-center py-kern-space-small px-kern-space-default",
            {
              "border-t border-kern-grey-200": index > 0,
            },
          )}
        >
          <div className="flex gap-kern-dimension-small">
            <Icon
              name="check-circle"
              className={classNames("text-kern-grey-200", {
                "text-kern-feedback-success!":
                  antrag.absaetze && antrag.absaetze.length > 0,
              })}
            />
            <span className="kern-body--default">
              {
                translations.geldEinklagenAnwaltschaft
                  .bezifferterZahlungsantragHeadline.de
              }{" "}
              {index + 1}{" "}
              {antrag.internesSchlagwortFordureung &&
                `(${antrag.internesSchlagwortFordureung})`}
            </span>
          </div>
          <Button
            look="secondary"
            href={getAbsaetzeBaseUrl(index)}
            iconRight={
              <Icon name="chevron-right" className="text-kern-action-default" />
            }
          >
            {translations.geldEinklagenAnwaltschaft.addVortragButton.de}
          </Button>
        </div>
      ))}
    </div>
  );
};
