import { arrayIsNonEmpty } from "~/util/array";
import { type ButtonProps } from "../common/Button";
import ButtonContainer from "../common/ButtonContainer";
import { type HeadingProps } from "../common/Heading";
import { GridItem } from "../layout/grid/GridItem";
import KernButton from "./KernButton";
import KernLabel from "./KernLabel";
import { KernIcon } from "./common/KernIcon";

type Props = {
  identifier?: string;
  label?: HeadingProps;
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
    >
      <nav aria-label="Inhalt">
        <div>
          {label && <KernLabel {...label} />}
          {links && links.length > 0 && (
            <ul className="list-none pl-0! mt-10">
              {links.map((link) => (
                <li
                  key={link.text ?? link.url}
                  className="list-none flex mb-10"
                >
                  <a href={link.url} className="kern-link no-underline!">
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
          <ButtonContainer>
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </nav>
    </GridItem>
  );
};

export default KernTableOfContents;
