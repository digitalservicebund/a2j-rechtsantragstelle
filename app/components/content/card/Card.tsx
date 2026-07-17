import { useId } from "react";
import Button from "../../common/Button";
import { GridItem } from "~/components/layout/grid/GridItem";
import Heading from "~/components/common/Heading";

export type CardProps = {
  id: string;
  title: string;
  heading: string;
  description: string;
  buttonLabel: string;
};

const Card = ({ heading, title, description, buttonLabel }: CardProps) => {
  const headingId = useId();

  return (
    <GridItem
      mdColumn={{ start: 1, span: 4 }}
      lgColumn={{ start: 3, span: 4 }}
      xlColumn={{ start: 3, span: 4 }}
      className="flex flex-col gap-kern-space-default"
    >
      <article className="kern-card">
        <div className="kern-card__container bg-kern-neutral-025!">
          <header className="kern-card__header">
            <hgroup className="kern-hgroup">
              <p
                className="kern-label text-kern-layout-text-muted! font-normal!"
                id={headingId}
              >
                {heading}
              </p>
              <Heading
                tagName="h2"
                size="medium"
                text={title}
                managedByParent
              />
            </hgroup>
          </header>
          <section className="kern-card__body">
            <p className="kern-body">{description}</p>
          </section>
          <footer className="kern-card__footer pt-kern-space-x-large!">
            <Button
              aria-describedby={headingId}
              text={buttonLabel}
              look="secondary"
            />
          </footer>
        </div>
      </article>
    </GridItem>
  );
};

export default Card;
