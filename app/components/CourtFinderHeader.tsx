import type { PropsWithChildren } from "react";
import Container from "./Container";

type CourtFinderHeaderProps = PropsWithChildren<{
  label: string;
}>;

const CourtFinderHeader = ({ label, children }: CourtFinderHeaderProps) => {
  return (
    <Container>
      <div className="ds-stack-24">
        <div className="ds-label-03-reg">{label}</div>
        <h1 className="ds-heading-02-reg">{children}</h1>
      </div>
    </Container>
  );
};

export default CourtFinderHeader;
