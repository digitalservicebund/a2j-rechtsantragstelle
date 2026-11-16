import { useFlowLoaderDataContext } from "~/components/hooks/useFlowLoaderDataContext";
import { getSelectableKlageParties } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/bezifferteZahlungsUndNebenantraege/klageParteiCheckboxesHelpers";
import { useKlageParties } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/useKlageParties";
import { getParteivernehmungBeweisCheckboxLabel } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { type Parteivernehmung } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";

export const ParteivernehmungBeweisBody = ({
  parteivernehmung,
}: {
  parteivernehmung: Parteivernehmung;
}) => {
  const { userData } = useFlowLoaderDataContext();
  const { klageParteienWithIndex: klagenden } = useKlageParties({
    userData,
    relationship: "klagende",
  });
  const { klageParteienWithIndex: beklagten } = useKlageParties({
    userData,
    relationship: "beklagte",
  });
  const parties = [
    ...getSelectableKlageParties(klagenden, "klagende", true),
    ...getSelectableKlageParties(beklagten, "beklagte", true),
  ].filter(({ id }) => parteivernehmung.personen[id] === "on");
  return (
    <div className="flex flex-col gap-kern-space-small">
      {parties.map(({ index, party, relationship, representative }) =>
        getParteivernehmungBeweisCheckboxLabel(
          index,
          party,
          relationship,
          representative,
        ),
      )}
    </div>
  );
};
