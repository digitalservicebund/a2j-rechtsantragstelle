import { arrayIsNonEmpty } from "~/util/array";
import { GridItem } from "../layout/grid/GridItem";
import KernButton, { type ButtonProps } from "../kern/KernButton";
import KernButtonContainer from "../kern/KernButtonContainer";
import KernHeading, { type KernHeadingProps } from "../kern/KernHeading";

type Props = {
  identifier?: string;
  label?: KernHeadingProps;
  heading?: KernHeadingProps;
  links?: Array<{ text?: string; url: string }>;
  buttons?: ButtonProps[];
};

const TableOfContents = ({
  identifier,
  label,
  heading,
  links,
  buttons,
}: Props) => {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="py-24"
      id={identifier}
    >
      <div className="ds-stack ds-stack-16">
        <div className="ds-stack ds-stack-8">
          {label && <KernHeading {...label} />}
          {heading && <KernHeading {...heading} />}
          {links && links.length > 0 && (
            <ul className="list-none pl-0 ds-stack ds-stack-16">
              {links.map((link) => (
                <li key={link.text ?? link.url}>
                  <a
                    className="visited:text-black text-black! flex"
                    href={link.url}
                  >
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
      </div>
    </GridItem>
  );
};

export default TableOfContents;
