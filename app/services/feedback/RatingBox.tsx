import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Heading from "~/components/Heading";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

export const wasHelpfulFieldname = "wasHelpful";

export interface RatingBoxProps {
  heading: string;
  url: string;
  context?: string;
  yesButtonLabel: string;
  noButtonLabel: string;
}

export const RatingBox = ({
  heading,
  url,
  context,
  yesButtonLabel,
  noButtonLabel,
}: RatingBoxProps) => {
  const wasHelpfulFetcher = useFetcher();
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  return (
    <>
      <Heading look="ds-label-01-bold" tagName="h2" text={heading} />
      <wasHelpfulFetcher.Form
        method="post"
        action={`/action/send-rating?url=${url}&context=${
          context ?? ""
        }&js=${String(jsAvailable)}`}
      >
        <ButtonContainer>
          <Button
            iconLeft={<ThumbUpIcon />}
            look="tertiary"
            name={wasHelpfulFieldname}
            value="yes"
            type="submit"
          >
            {yesButtonLabel}
          </Button>
          <Button
            iconLeft={<ThumbDownIcon />}
            look="tertiary"
            name={wasHelpfulFieldname}
            value="no"
            type="submit"
          >
            {noButtonLabel}
          </Button>
        </ButtonContainer>
      </wasHelpfulFetcher.Form>
    </>
  );
};
