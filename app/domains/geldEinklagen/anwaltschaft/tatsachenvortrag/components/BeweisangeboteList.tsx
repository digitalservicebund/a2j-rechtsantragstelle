import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { focusOnItem } from "~/domains/geldEinklagen/anwaltschaft/shared/focusOnItem";
import { useAbsaetze } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeContext";
import {
  MAX_BEWEISE,
  type BeweiseArray,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { translations } from "~/services/translations/translations";
import { getBeweisType } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";

export const BeweisangeboteList = ({
  beweise,
  absatzArrayIndex,
}: {
  beweise: BeweiseArray;
  absatzArrayIndex: number;
}) => {
  const { absaetzeBaseUrl, absaetzeArrayName } = useAbsaetze();
  const beweiseBaseUrl = `${absaetzeBaseUrl}/${absatzArrayIndex}/beweise`;
  const beweisIdPrefix = `absatz-${absatzArrayIndex}-beweis-`;
  const deleteArrayItem = useDeleteArrayItem(
    `${absaetzeArrayName}#beweise`,
    beweiseBaseUrl,
    focusOnItem(beweisIdPrefix),
  );
  const nextItemIndex = beweise?.length ?? 0;
  return (
    <NestedArrayItemList
      heading={translations.geldEinklagenAnwaltschaft.beweisangeboteTitle.de}
      headingSuffix={translations.geldEinklagenAnwaltschaft.optionalSuffix.de}
      headingId={`absatz-${absatzArrayIndex}-beweisangebote`}
      subtitle={
        translations.geldEinklagenAnwaltschaft.beweisangeboteSubtitle.de
      }
      items={
        beweise
          ? beweise.map((beweis, index) => ({
              key: `absatz-${absatzArrayIndex}-beweisangebote-${index}`,
              id: `absatz-${absatzArrayIndex}-beweisangebote-${index}`,
              content: null, // TODO: build out display
              editButton: {
                ariaLabel: `${translations.geldEinklagenAnwaltschaft.beweis.de} ${translations.arraySummary.arrayEditButtonLabel.de}`, // TODO: fix label
                href: `${beweiseBaseUrl}/${index}/daten`,
              },
              deleteButton: {
                title:
                  getBeweisType(beweis.beweismittel) === "document"
                    ? translations.geldEinklagenAnwaltschaft
                        .beweisangebotDeletionTitle.de
                    : translations.geldEinklagenAnwaltschaft
                        .beweisangebotPersonDeletionTitle.de,
                description: "", // TODO: Fill out
                onDelete: () => deleteArrayItem(index),
              },
            }))
          : []
      }
      addLinks={
        nextItemIndex < MAX_BEWEISE
          ? [
              {
                id: `${beweisIdPrefix}add`,
                href: `${beweiseBaseUrl}/${nextItemIndex}/daten`,
                label: `${translations.geldEinklagenAnwaltschaft.beweis.de} ${translations.arraySummary.arrayAddButtonLabel.de}`,
              },
            ]
          : undefined
      }
    />
  );
};
