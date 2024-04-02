import Background from "./Background";
import Box from "./Box";
import Container from "./Container";

export type FeedbackProps = Readonly<{
  heading?: string;
  content?: string;
}>;

// Appends the current page title as email subject
export function augmentFeedback(
  feedback: FeedbackProps,
  subject?: string,
): FeedbackProps {
  const emailRegex = /[^\s]*@[a-z0-9.-]*/;
  return {
    heading: feedback.heading,
    content:
      feedback.content?.replace(
        emailRegex,
        (email) =>
          `[${email}](mailto:${email}?subject=${encodeURI(subject ?? "")})`,
      ) ?? undefined,
  };
}

export default function FeedbackBanner({ heading, content }: FeedbackProps) {
  return (
    (heading || content) && (
      <Background backgroundColor="midBlue" paddingTop="32" paddingBottom="40">
        <Container paddingTop="0" paddingBottom="0">
          <Box
            heading={{
              tagName: "h2",
              look: "ds-label-01-bold",
              text: heading,
            }}
            content={{ markdown: content ?? "" }}
          ></Box>
        </Container>
      </Background>
    )
  );
}
