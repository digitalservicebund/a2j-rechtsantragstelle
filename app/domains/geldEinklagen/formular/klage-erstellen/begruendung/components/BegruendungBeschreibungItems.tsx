import { Icon } from "~/components/common/Icon";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { BegruendungBeschreibungBeweise } from "./BegruendungBeschreibungBeweise";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";

export type BegruendungBeschreibungItemsProps = {
  readonly itemIndex: number;
  readonly abschnitte: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >[number];
};

const BegruendungBeschreibungItems = ({
  itemIndex,
  abschnitte,
}: BegruendungBeschreibungItemsProps) => {
  return (
    <div className="kern-summary pb-24">
      <div className="kern-summary__header">
        <h2 className="kern-body kern-body--large kern-body--bold p-0!">
          {translations.geldEinklagen.begruendungBeschreibungHeadline.de}{" "}
          {itemIndex + 1}
        </h2>
      </div>
      <div className="kern-summary__body bg-white!">
        <div className="flex flex-col gap-kern-space-large">
          <span className="kern-body kern-body--default kern-body--bold p-0!">
            {translations.geldEinklagen.begruendungBeschreibungTitle.de}
          </span>
          <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
            {abschnitte.beschreibung}
          </span>
          <a
            className="kern-link kern-link--default kern-link--bold p-0! no-underline! hover:underline!"
            href={`/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/${itemIndex}/abschnitte`}
          >
            <Icon name="edit" className="size-[1em] mb-[3.5px]! inline! mr-4" />
            {translations.geldEinklagen.begruendungBeschreibungEditButton.de}
          </a>
          <BegruendungBeschreibungBeweise
            itemIndex={itemIndex}
            abschnitte={abschnitte}
          />
          <div className="flex flex-row-reverse">
            <Button
              href={"/"}
              look="secondary"
              className="kern-body kern-body--default kern-body--regular text-kern-feedback-danger!"
              iconLeft={
                <Icon name={"trash"} className="fill-kern-action-default!" />
              }
            >
              {
                translations.geldEinklagen.begruendungBeschreibungDeleteButton
                  .de
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungItems;
