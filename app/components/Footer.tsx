import React from "react";
import Container from "./Container";
import type { ImageProps } from "./Image";
import Image from "./Image";
import type { LinkProps } from "./Link";
import Link from "./Link";
import type { ParagraphProps } from "./Paragraph";
import Paragraph from "./Paragraph";

export interface FooterProps extends React.ClassAttributes<HTMLHeadingElement> {
  image: ImageProps;
  paragraphs: ParagraphProps[];
  links: LinkProps[];
}

export default function Footer({
  image,
  paragraphs,
  links,
  ...props
}: FooterProps) {
  return (
    <Container hasBackground={false}>
      <div className="footer">
        <div className="footer-info">
          <div>
            {paragraphs.map((paragraph, index) => (
              <Paragraph
                {...paragraph}
                {...{ className: "label-03-reg", key: index }}
              />
            ))}
          </div>
          <Image {...image} />
        </div>
        <div className="footer-links">
          {links.map((link, index) => (
            <Link {...link} {...{ className: "link-02-bold", key: index }} />
          ))}
        </div>
      </div>
    </Container>
  );
}
