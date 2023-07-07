import Background from "./Background";
import Container from "./Container";

export default function ErrorBox({ errorMessage }: { errorMessage: string }) {
  return (
    <Background backgroundColor="red">
      <Container>
        <div className="ds-stack-16">
          <h1 className="ds-heading-02-reg">Fehler aufgetreten</h1>
          <pre>{errorMessage}</pre>
        </div>
      </Container>
    </Background>
  );
}
