import { config as configWeb } from "~/services/env/web";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import Background from "./Background";
import Container from "./Container";

export function EnvironmentBanner() {
  return configWeb().ENVIRONMENT !== "production" ? (
    <Background backgroundColor="yellow">
      <Container paddingTop="16" paddingBottom="16">
        <div className="flex gap-16">
          <WarningAmber />
          <p className="max-w-full">
            Vorsicht: Sie befinden sich auf unserer Testumgebung!
          </p>
        </div>
      </Container>
    </Background>
  ) : (
    ""
  );
}
