import Button from "../../common/Button";
import Heading from "~/components/common/Heading";

export type CardProps = {
  id: string;
  title: string;
  heading: string;
  description: string;
  buttonLabel: string;
};

export type CardGroupItem = CardProps & {
  span: number;
};

const Card = ({ id, heading, title, description, buttonLabel }: CardProps) => {
  return (
    <article className="kern-card">
      <div className="kern-card__container bg-kern-neutral-025!">
        <header className="kern-card__header">
          <hgroup className="kern-hgroup">
            <p
              className="kern-label text-kern-layout-text-muted! font-normal!"
              id={id}
            >
              {heading}
            </p>
            <Heading tagName="h2" size="medium" text={title} managedByParent />
          </hgroup>
        </header>
        <section className="kern-card__body">
          <p className="kern-body">{description}</p>
        </section>
        <footer className="kern-card__footer pt-kern-space-x-large!">
          <Button aria-describedby={id} text={buttonLabel} look="secondary" />
        </footer>
      </div>
    </article>
  );
};

export default Card;
