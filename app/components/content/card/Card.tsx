import Button from "../../common/Button";
import Heading from "~/components/common/Heading";

type CardProps = {
  id: string;
  preline?: string;
  heading?: string;
  description?: string;
  buttonLabel?: string;
  link: string;
};

export type CardGroupItem = CardProps & {
  span: number;
};

const Card = ({
  id,
  preline,
  heading,
  description,
  buttonLabel,
  link,
}: CardProps) => {
  return (
    <article className="kern-card">
      <div className="kern-card__container p-kern-space-x-large! bg-kern-neutral-025! rounded-sm">
        <header className="kern-card__header">
          <hgroup className="kern-hgroup">
            {preline && (
              <p className="kern-preline text-kern-layout-text-muted! font-normal! pb-10!">
                {preline}
              </p>
            )}
            {heading && (
              <Heading
                tagName="h3"
                text={heading}
                size="medium"
                managedByParent
              />
            )}
          </hgroup>
        </header>
        {description && (
          <section className="kern-card__body">
            <p className="kern-body">{description}</p>
          </section>
        )}
        {buttonLabel && (
          <footer className="kern-card__footer pt-kern-space-x-large!">
            <Button
              aria-describedby={id}
              text={buttonLabel}
              look="secondary"
              className="md:flex-none!"
              href={link}
            />
          </footer>
        )}
      </div>
    </article>
  );
};

export default Card;
