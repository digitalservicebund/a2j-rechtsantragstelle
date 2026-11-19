import { Icon } from "~/components/common/Icon";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { getAllConnectedVortraegeIndices } from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";
import { type SonstigeAntrag } from "~/domains/geldEinklagen/anwaltschaft/sonstigeAntraege/pages";
import { translations } from "~/services/translations/translations";

const DeletionInlineNoticeText = () => {
  return (
    <div className="flex flex-col gap-kern-space-small kern-body">
      <span className="kern-body--bold">
        {translations.geldEinklagenAnwaltschaft.auswirkungen.de}
      </span>
      <span className="kern-body--default">
        {translations.geldEinklagenAnwaltschaft.antragDeletionAuswirkungen.de}
      </span>
      <span className="kern-body--bold">
        {translations.geldEinklagenAnwaltschaft.dasKoennenSieTun.de}:
      </span>
      <ul className="list-disc pl-kern-dimension-large">
        <li>
          <span className="kern-body--bold">
            {translations.geldEinklagenAnwaltschaft.keepAndEdit.de}:{" "}
          </span>
          <span className="kern-body--default">
            {translations.geldEinklagenAnwaltschaft.keepAndEditAntrag.de}
          </span>
        </li>
        <li>
          <span className="kern-body--bold">
            {translations.geldEinklagenAnwaltschaft.deletePermanently.de}:{" "}
          </span>
          <span className="kern-body--default">
            {translations.geldEinklagenAnwaltschaft.deleteAntragPermanently.de}
          </span>
        </li>
      </ul>
    </div>
  );
};

export const SonstigeAntraegeDeletionDialog = ({
  item,
  antragNumber,
}: {
  item: SonstigeAntrag;
  antragNumber: number;
}) => {
  const { userData } = useFormFlow();
  const hasConnectedVortraege =
    getAllConnectedVortraegeIndices(item, userData).length > 0;

  return (
    <div className="flex flex-col gap-kern-space-default">
      {hasConnectedVortraege && (
        <InlineNotice
          title={
            translations.geldEinklagenAnwaltschaft.antragDeletionWarning.de
          }
          tagName="p"
          look="warning"
          content={<DeletionInlineNoticeText />}
        />
      )}
      <p>{translations.deleteDialog.description.de}</p>
      <div className="flex gap-kern-space-small items-start">
        <Icon name="draft" className="size-kern-dimension-default" />
        <p className="font-bold">
          {translations.geldEinklagenAnwaltschaft.soenstigeProzessantragItem.de}{" "}
          {antragNumber}{" "}
          {item.internesSchlagwort ? `(${item.internesSchlagwort})` : ""}
        </p>
      </div>
    </div>
  );
};
