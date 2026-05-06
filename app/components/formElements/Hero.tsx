import { GridItem } from "~/components/layout/grid/GridItem";
import Heading, { type HeadingProps } from "./Heading";
import classNames from "classnames";
import Button, { type ButtonProps } from "./Button";
import { type RichTextProps } from "./RichText";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
  sectionBackgroundColor?: string;
  button?: ButtonProps;
}>;

export default function Hero({
  heading,
  content,
  sectionBackgroundColor,
  button,
}: Props) {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="flex flex-col gap-kern-space-default py-kern-space-x-large px-kern-space-large lg:px-0 xl:px-0"
    >
      <Heading
        {...heading}
        className={classNames({
          "text-white!": sectionBackgroundColor === "blue",
        })}
        managedByParent
      />
      {content && (
        <div
          className={classNames("text-kern-static-large font-medium", {
            "text-white!": sectionBackgroundColor === "blue",
          })}
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      )}
      {button && (
        <div>
          <Button {...button} />
        </div>
      )}
    </GridItem>
  );
}
