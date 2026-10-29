import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { type GeldEinklagenAnwaltschaftUserData } from "../../../../userData";
import { translations } from "~/services/translations/translations";
import { type KlageParteiVerhaeltnis } from "../../../klageParties/klagePartySchemas";
import {
  getBaseProzessbevollmaechtigteUrl,
  getProzessbevollmaechtigteArrayName,
} from "../prozessbevollmaechtigteHelpers";
import { focusOnProzessbevollmaechtigteTitle } from "../prozessbevollmaechtigteFocus";
import {
  MAX_PROZESSBEVOLLMAECHTIGTE,
  type ProzessbevollmaechtigteType,
} from "../prozessbevollmaechtigteSchemas";
import {
  useProzessbevollmaechtigte,
  type ProzessbevollmaechtigteWithArrayIndex,
} from "../useProzessbevollmaechtigte";
import Prozessbevollmaechtigte from "./Prozessbevollmaechtigte";

export const ProzessbevollmaechtigteUebersicht = ({
  relationship,
}: {
  relationship: KlageParteiVerhaeltnis;
}) => {
  const { userData, flowId } = useFormFlow();
  const prozessbevollmaechtigteWithIndex = useProzessbevollmaechtigte({
    relationship,
    userData: userData as GeldEinklagenAnwaltschaftUserData,
  });

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  return (
    <div className="flex flex-col gap-kern-space-2x-large">
      <ProzessbevollmaechtigteList
        items={prozessbevollmaechtigteWithIndex.filter(
          ({ prozessbevollmaechtigte }) =>
            prozessbevollmaechtigte.type === "einzelkanzlei",
        )}
        type={"einzelkanzlei"}
        addHref={`${getBaseProzessbevollmaechtigteUrl(relationship)}/${prozessbevollmaechtigteWithIndex.length}/einzelkanzlei-daten`}
        relationship={relationship}
        shouldDisableAddButton={
          prozessbevollmaechtigteWithIndex.length >= MAX_PROZESSBEVOLLMAECHTIGTE
        }
      />
      <ProzessbevollmaechtigteList
        items={prozessbevollmaechtigteWithIndex.filter(
          ({ prozessbevollmaechtigte }) =>
            prozessbevollmaechtigte.type === "berufsausuebungsgesellschaft",
        )}
        type={"berufsausuebungsgesellschaft"}
        addHref={`${getBaseProzessbevollmaechtigteUrl(relationship)}/${prozessbevollmaechtigteWithIndex.length}/berufsausuebungsgesellschaft-daten`}
        relationship={relationship}
        shouldDisableAddButton={
          prozessbevollmaechtigteWithIndex.length >= MAX_PROZESSBEVOLLMAECHTIGTE
        }
      />
    </div>
  );
};

const ProzessbevollmaechtigteList = ({
  items,
  type,
  addHref,
  relationship,
  shouldDisableAddButton,
}: {
  items: ProzessbevollmaechtigteWithArrayIndex[];
  type: ProzessbevollmaechtigteType;
  addHref: string;
  relationship: KlageParteiVerhaeltnis;
  shouldDisableAddButton: boolean;
}) => {
  const deleteArrayItem = useDeleteArrayItem(
    getProzessbevollmaechtigteArrayName(relationship),
  );
  const heading =
    type === "einzelkanzlei"
      ? translations.geldEinklagenAnwaltschaft.einzelkanzleiHeadline.de
      : translations.geldEinklagenAnwaltschaft
          .berufsausuebungsgesellschaftHeadline.de;

  return (
    <div className="kern-summary flex flex-col gap-kern-space-default">
      <div className="flex flex-col kern-summary__header p-0!">
        <h2
          className="kern-body kern-body--large kern-body--bold p-0!"
          id={`${relationship}-prozessbevollmaechtigte-${type}`}
          tabIndex={-1}
        >
          {heading}
        </h2>
      </div>
      {items.map(({ prozessbevollmaechtigte, arrayIndex }) => (
        <Prozessbevollmaechtigte
          key={prozessbevollmaechtigte.id ?? arrayIndex}
          index={arrayIndex}
          prozessbevollmaechtigte={prozessbevollmaechtigte}
          relationship={relationship}
          onDelete={async () => {
            await deleteArrayItem(
              getBaseProzessbevollmaechtigteUrl(relationship),
              arrayIndex,
            );
            focusOnProzessbevollmaechtigteTitle(relationship, type, arrayIndex);
          }}
        />
      ))}
      <div className="bg-kern-white px-kern-space-default py-kern-space-large border-dashed border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default)">
        <Button
          look="secondary"
          iconLeft={<Icon name="plus" className="text-kern-action-default" />}
          href={addHref}
          data-testid={`add-${type}`}
          fullWidth={true}
          disabled={shouldDisableAddButton}
          aria-disabled={shouldDisableAddButton}
        >
          {`${heading} ${translations.arraySummary.arrayAddButtonLabel.de}`}
        </Button>
      </div>
    </div>
  );
};
