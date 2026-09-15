import classNames from "classnames";
import Heading from "~/components/common/Heading";
import { Icon } from "~/components/common/Icon";

type CardProps = {
  id: string;
  preline?: string;
  heading?: string;
  description?: string;
  buttonLabel?: string;
  link: string;
  cardStyleOverrides?: string;
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
  cardStyleOverrides,
}: CardProps) => {
  return (
    <article className="kern-card">
      <div
        className={classNames(
          `kern-card__container p-kern-space-x-large! bg-kern-neutral-025 rounded-sm ${cardStyleOverrides}`,
        )}
      >
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
            <a
              href={link}
              className="kern-link no-underline! hover:underline!"
              aria-describedby={id}
              aria-label={buttonLabel}
            >
              <Icon
                name="arrow-forward"
                className="h-[1em] w-[1em] shrink-0 my-[0.25em]"
              />
              {buttonLabel}
            </a>
          </footer>
        )}
      </div>
    </article>
  );
};

export default Card;
