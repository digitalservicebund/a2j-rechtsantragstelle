import classNames from "classnames";
import React from "react";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import {
  type AntragRowItem,
  getAbsaetzeBaseUrl,
  getHauptantragTitle,
  getNebenantragTitle,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

const AntragRow = ({
  antrag,
  index,
  parentIndex,
}: {
  antrag: AntragRowItem;
  index: number;
  parentIndex?: number;
}) => {
  const isHauptantrag = "betragForderung" in antrag;
  const title = isHauptantrag
    ? getHauptantragTitle(antrag, index)
    : getNebenantragTitle(antrag, parentIndex ?? -1);
  return (
    <div
      className={classNames(
        "flex justify-between items-center py-kern-space-small px-kern-space-default",
        {
          "border-t border-kern-grey-200": index > 0 || !isHauptantrag,
          "pl-kern-space-2x-large": !isHauptantrag,
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
        <span className="kern-body--default">{title}</span>
      </div>
      <Button
        look="secondary"
        href={getAbsaetzeBaseUrl(
          parentIndex ?? index,
          parentIndex !== undefined ? index : undefined,
        )}
        iconRight={
          <Icon name="chevron-right" className="text-kern-action-default" />
        }
      >
        {translations.geldEinklagenAnwaltschaft.addVortragButton.de}
      </Button>
    </div>
  );
};

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
        /* oxlint-disable-next-line react/no-array-index-key */
        <React.Fragment key={`hauptantrag-${index}`}>
          <AntragRow antrag={antrag} index={index} />
          {antrag.nebenantraege?.map((nebenantrag, nebenantragIndex) => (
            <AntragRow
              // oxlint-disable-next-line react/no-array-index-key
              key={`nebenantrag-${nebenantragIndex}`}
              antrag={nebenantrag}
              index={nebenantragIndex}
              parentIndex={index}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
