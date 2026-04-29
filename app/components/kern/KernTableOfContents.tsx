import { arrayIsNonEmpty } from "~/util/array";
import { GridItem } from "../layout/grid/GridItem";
import KernButton, { type ButtonProps } from "./KernButton";
import KernLabel from "./KernLabel";
import { KernIcon } from "./common/KernIcon";
import KernButtonContainer from "./KernButtonContainer";
import { type KernHeadingProps } from "./KernHeading";

type Props = {
  identifier?: string;
  label?: KernHeadingProps;
  links?: Array<{ text?: string; url: string }>;
  buttons?: ButtonProps[];
};

const KernTableOfContents = ({ identifier, label, links, buttons }: Props) => {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      id={identifier}
      className="px-kern-space-large lg:px-0 xl:px-0"
    >
      <nav aria-labelledby="table-of-contents-label">
        <div>
          {label && (
            <KernLabel {...label} elementId="table-of-contents-label" />
          )}
          {links && links.length > 0 && (
            <ul className="list-none pl-0! mt-10">
              {links.map((link) => (
                <li
                  key={link.text ?? link.url}
                  className="list-none flex mb-10"
                >
                  <a
                    href={link.url}
                    className="kern-link no-underline!"
                    aria-label={link.text}
                  >
                    <KernIcon
                      name="arrow-downward"
                      className="h-[1em] w-[1em] shrink-0 my-[0.25em]"
                    />
                    {link.text ?? ""}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {arrayIsNonEmpty(buttons) && (
          <KernButtonContainer>
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </KernButtonContainer>
        )}
      </nav>
    </GridItem>
  );
};

export default KernTableOfContents;
