import type { PropsWithChildren } from "react";
import Heading from "./common/Heading";
import Container from "./layout/Container";

type CourtFinderHeaderProps = PropsWithChildren<{
  readonly label: string;
}>;

const CourtFinderHeader = ({ label, children }: CourtFinderHeaderProps) => {
  return (
    <Container>
      <div className="ds-stack ds-stack-24">
        <Heading tagName="div" look="ds-label-03-reg" text={label} />
        <Heading tagName="h1" look="ds-heading-02-reg">
          {children}
        </Heading>
      </div>
    </Container>
  );
};

export default CourtFinderHeader;
