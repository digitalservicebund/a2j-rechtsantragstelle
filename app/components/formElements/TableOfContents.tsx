import { arrayIsNonEmpty } from "~/util/array";
import { GridItem } from "../layout/grid/GridItem";
import Button, { type ButtonProps } from "./Button";
import Label from "./Label";
import { Icon } from "../common/Icon";
import ButtonContainer from "./ButtonContainer";
import { type HeadingProps } from "./Heading";

type Props = {
  identifier?: string;
  label?: HeadingProps;
  links?: Array<{ text?: string; url: string }>;
  buttons?: ButtonProps[];
};

const TableOfContents = ({ identifier, label, links, buttons }: Props) => {
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
          {label && <Label {...label} elementId="table-of-contents-label" />}
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
                    <Icon
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
              <Button key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </nav>
    </GridItem>
  );
};

export default TableOfContents;
