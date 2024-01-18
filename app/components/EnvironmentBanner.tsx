import { config as configWeb } from "~/services/env/web";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import Background from "./Background";
import Container from "./Container";

type EnvironmentBannerProps = {
  readonly environmentBannerLabel: string | null | undefined;
};

export function EnvironmentBanner({
  environmentBannerLabel,
}: EnvironmentBannerProps) {
  return configWeb().ENVIRONMENT !== "production" ? (
    <Background backgroundColor="yellow">
      <Container paddingTop="16" paddingBottom="16">
        <div className="flex gap-16">
          <WarningAmber />
          <p className="max-w-full">{environmentBannerLabel}</p>
        </div>
      </Container>
    </Background>
  ) : (
    ""
  );
}
