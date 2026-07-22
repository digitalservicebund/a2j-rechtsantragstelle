import { useLoaderData } from "react-router";
import Heading from "~/components/common/Heading";
import CardGroup from "~/components/content/card/CardGroup";
import ContentComponents from "~/components/content/ContentComponents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { fetchPage } from "~/services/cms/index.server";

export const loader = async () => {
  const { pageMeta, ...props } = await fetchPage("/");
  return { ...props, meta: pageMeta };
};

export default function Index() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <>
      {/* <ContentComponents content={content} /> */}

      <GridSection>
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 12 }}
            mdColumn={{ start: 1, span: 12 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
          >
            <Heading
              tagName="h2"
              text="Onlinedienste im Überblick"
              className="kern-heading-x-large p-0! outline-none pt-40! pb-40!"
              managedByParent
            />

            <CardGroup
              cards={[
                {
                  id: "1",
                  title: "Digitale Zahlungsklage für Fluggastrechte",
                  heading:
                    "Online-Verfahren: Geld bei Flugproblemen einfordern",
                  description:
                    "Ihr Flug war verspätet, wurde annulliert oder Sie wurden nicht mitgenommen? Hier finden Sie Informationen darüber, welche Ansprüche und Handlungsoptionen Sie haben. Nach dem Vorab-Check können Sie direkt eine Klage erstellen, wenn sich das ermittelte Amtsgericht am Pilotprojekt beteiligt. Im Anschluss können Sie Ihre Klage selbst digital bei Gericht einreichen und ein Online-Verfahren eröffnen.",
                  buttonLabel: "Klage erstellen",
                  span: 4,
                },
                {
                  id: "2",
                  title: "Digitale Zahlungsklage für Fluggastrechte",
                  heading:
                    "Online-Verfahren: Geld bei Flugproblemen einfordern",
                  description:
                    "Ihr Flug war verspätet, wurde annulliert oder Sie wurden nicht mitgenommen? Hier finden Sie Informationen darüber, welche Ansprüche und Handlungsoptionen Sie haben. Nach dem Vorab-Check können Sie direkt eine Klage erstellen, wenn sich das ermittelte Amtsgericht am Pilotprojekt beteiligt. Im Anschluss können Sie Ihre Klage selbst digital bei Gericht einreichen und ein Online-Verfahren eröffnen.",
                  buttonLabel: "Klage erstellen",
                  span: 4,
                },
                {
                  id: "3",
                  heading: "Beratungshilfe",
                  title:
                    "Finanzielle Hilfe für ein Gespräch mit einer Anwältin oder einem Anwalt erhalten",
                  description:
                    "Hier finden Sie Informationen über Beratungshilfe und welche Voraussetzungen es dafür gibt. Sie können mit dem Vorab-Check prüfen, ob der Staat die Kosten für die anwaltliche Beratung übernimmt und direkt den Antrag auf Beratungshilfe ausfüllen.",
                  buttonLabel: "Zur Beratungshilfe",
                  span: 4,
                },
                {
                  id: "4",
                  heading: "Prozesskostenhilfe",
                  title: "Finanzielle Hilfe für ein Gerichtsverfahren erhalten",
                  description:
                    "Mit der Prozesskostenhilfe werden die Kosten eines Gerichtsverfahrens finanziert. Sie können Prozesskostenhilfe bekommen, wenn Sie jemanden verklagen wollen oder verklagt wurden. Das Gericht entscheidet darüber, ob Sie Prozesskostenhilfe erhalten. Mithilfe eines Formulars müssen Sie dem Gericht nachweisen, dass Sie ansonsten die Kosten des Prozesses nicht zahlen können.",
                  buttonLabel: "Zur Prozesskostenhilfe",
                  span: 4,
                },
                {
                  id: "5",
                  heading: "Zwangsvollstreckung",
                  title: "Geld bei einer Kontopfändung schützen",
                  description:
                    "Wenn Ihr Konto gepfändet wurde oder eine Pfändung droht, gibt es Hilfe. Hier erfahren Sie, wie Sie Ihr Geld schützen und trotz einer Pfändung darauf zugreifen können. Der Wegweiser zeigt Ihnen, was Sie dafür tun müssen, welche Beträge und Guthaben Sie schützen können und welche Unterlagen nötig sind.",
                  buttonLabel: "Zum Wegweiser Kontopfändung",
                  span: 4,
                },
                {
                  id: "6",
                  heading: "Erbschein",
                  title: "Notwendigkeit für Erbschein prüfen",
                  description:
                    "Wenn Sie erben, brauchen Sie in einigen Fällen einen Erbschein. Sie erfahren hier, ob Sie für Ihren Erbfall einen Erbschein benötigen. Sie erfahren auch, was Sie dafür tun müssen und zu welchem Gericht Sie gehen müssen.",
                  buttonLabel: "Zum Wegweiser Erbschein",
                  span: 4,
                },
              ]}
            />
            <Heading
              tagName="h2"
              text="Hilfreiche Informationen"
              managedByParent
              className="kern-heading-x-large p-0! outline-none pt-40! pb-40!"
            />

            <CardGroup
              cards={[
                {
                  id: "7",
                  heading: "Rechtsprobleme",
                  title: "Rechtliche Unterstützung für Menschen mit wenig Geld",
                  description:
                    "Finden Sie Informationen zur Beratungshilfe, Prozesskostenhilfe und zu weiteren Beratungsmöglichkeiten.",
                  buttonLabel: "„Mein Justizpostfach“ einrichten",
                  span: 6,
                },
                {
                  id: "8",
                  heading: "Anleitung",
                  title: "Anleitung: „Mein Justizpostfach“ einrichten",
                  description:
                    "Mit „Mein Justizpostfach“ können Sie mit der Justiz kommunizieren und Dokumente online einreichen (zum Beispiel einen Antrag oder eine Klage).",
                  buttonLabel: "Zu den finanziellen Hilfen",
                  span: 6,
                },
              ]}
            />
            <Heading
              tagName="h2"
              text="Mitmachen"
              className="kern-heading-x-large p-0! outline-none pt-40! pb-40!"
              managedByParent
            />
            <CardGroup
              cards={[
                {
                  id: "9",
                  heading: "Studie",
                  title: "Gestalten Sie die digitalen Angebote der Justiz mit",
                  description:
                    "Wir wollen digitale Justiz-Angebote entwickeln, die für alle Menschen gut funktionieren. Ihre Hilfe und Unterstützung ist dabei sehr wertvoll. Teilen Sie Ihre Erfahrungen mit uns. Testen Sie neue Angebote. Für viele Tests und Gespräche bekommen Sie als Dankeschön eine Aufwandsentschädigung, zum Beispiel einen Einkaufsgutschein.",
                  buttonLabel: "Jetzt mitmachen",
                  span: 6,
                },
              ]}
            />
          </GridItem>
        </Grid>
      </GridSection>
    </>
  );
}
