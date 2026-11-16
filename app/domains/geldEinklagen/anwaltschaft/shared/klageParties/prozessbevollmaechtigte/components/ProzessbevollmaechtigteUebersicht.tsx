import { useFormFlow } from "~/components/hooks/formFlowContext";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { type GeldEinklagenAnwaltschaftUserData } from "../../../../userData";
import { translations } from "~/services/translations/translations";
import { type KlageParteiVerhaeltnis } from "../../../klageParties/klagePartySchemas";
import {
  getBaseProzessbevollmaechtigteUrl,
  getProzessbevollmaechtigteArrayName,
  MAX_PROZESSBEVOLLMAECHTIGTE,
} from "../prozessbevollmaechtigteHelpers";
import { focusOnProzessbevollmaechtigteTitle } from "../prozessbevollmaechtigteFocus";
import { type ProzessbevollmaechtigteType } from "../prozessbevollmaechtigteSchemas";
import {
  useProzessbevollmaechtigte,
  type ProzessbevollmaechtigteWithArrayIndex,
} from "../useProzessbevollmaechtigte";
import Prozessbevollmaechtigte from "./Prozessbevollmaechtigte";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";

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
    getBaseProzessbevollmaechtigteUrl(relationship),
    focusOnProzessbevollmaechtigteTitle(relationship, type),
  );
  const heading =
    type === "einzelkanzlei"
      ? translations.geldEinklagenAnwaltschaft.einzelkanzleiHeadline.de
      : translations.geldEinklagenAnwaltschaft
          .berufsausuebungsgesellschaftHeadline.de;

  return (
    <ArrayItemListSection
      heading={heading}
      helperText={
        type === "berufsausuebungsgesellschaft" &&
        translations.geldEinklagenAnwaltschaft
          .berufsausuebungsgesellschaftHelperText.de
      }
      headingId={`${relationship}-prozessbevollmaechtigte-${type}`}
      addButton={{
        href: addHref,
        disabled: shouldDisableAddButton,
        dataTestId: `add-${type}`,
        buttonText: `${heading} ${translations.arraySummary.arrayAddButtonLabel.de}`,
      }}
    >
      {items.map(({ prozessbevollmaechtigte, arrayIndex }) => (
        <Prozessbevollmaechtigte
          key={prozessbevollmaechtigte.id ?? arrayIndex}
          index={arrayIndex}
          prozessbevollmaechtigte={prozessbevollmaechtigte}
          relationship={relationship}
          onDelete={() => deleteArrayItem(arrayIndex)}
        />
      ))}
    </ArrayItemListSection>
  );
};
