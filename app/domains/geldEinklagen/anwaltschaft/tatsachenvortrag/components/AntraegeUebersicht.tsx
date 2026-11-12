import classNames from "classnames";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import {
  getOrderedAntraege,
  getVortragIndex,
  type OrderedAntrag,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/antragOrdering";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

const addVortragActionUrl = "/action/geld-einklagen/anwaltschaft/add-vortrag";

const AntragRow = ({
  antrag,
  hasAbsaetze,
  isFirst,
}: {
  antrag: OrderedAntrag;
  hasAbsaetze: boolean;
  isFirst: boolean;
}) => (
  <div
    className={classNames(
      "flex justify-between items-center py-kern-space-small px-kern-space-default",
      {
        "border-t border-kern-grey-200": !isFirst,
        "pl-kern-space-2x-large": antrag.isNebenantrag,
      },
    )}
  >
    <div className="flex gap-kern-dimension-small">
      <Icon
        name="check-circle"
        className={classNames("text-kern-grey-200", {
          "text-kern-feedback-success!": hasAbsaetze,
        })}
      />
      <span className="kern-body--default">{antrag.title}</span>
    </div>
    <form method="post" action={addVortragActionUrl}>
      <CsrfInput />
      <input type="hidden" name="antragKey" value={antrag.key} />
      <Button
        look="secondary"
        type="submit"
        iconRight={
          <Icon name="chevron-right" className="text-kern-action-default" />
        }
      >
        {translations.geldEinklagenAnwaltschaft.addVortragButton.de}
      </Button>
    </form>
  </div>
);

export const AntraegeUebersicht = () => {
  const { userData, flowId } = useFormFlow();
  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }
  const userDataAnwaltschaft = userData as GeldEinklagenAnwaltschaftUserData;
  return (
    <div>
      {getOrderedAntraege(userDataAnwaltschaft).map((antrag, index) => {
        const vortragIndex = getVortragIndex(
          userDataAnwaltschaft,
          antrag.antragId,
        );
        const absaetze =
          userDataAnwaltschaft.vortraege?.[vortragIndex]?.absaetze ?? [];
        return (
          <AntragRow
            key={antrag.key}
            antrag={antrag}
            hasAbsaetze={absaetze.length > 0}
            isFirst={index === 0}
          />
        );
      })}
    </div>
  );
};
