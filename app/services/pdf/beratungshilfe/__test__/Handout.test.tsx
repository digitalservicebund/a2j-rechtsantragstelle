import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { happyPathData } from "tests/fixtures/beratungshilfeFormularData";
import Handout, { dynamicSteps } from "~/services/pdf/beratungshilfe/Handout";

vi.mock("@react-pdf/renderer", async () => {
  const pdfRenderer = await vi.importActual("@react-pdf/renderer");
  return {
    ...pdfRenderer,
    Document: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Font: { register: vi.fn() },
    Page: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    PDFViewer: vi.fn(() => null),
    Svg: () => <div>SVG</div>,
    Text: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    View: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

describe("Handout", () => {
  describe("Print Submission", () => {
    it("should render the correct copy for a valid Amtsgericht", () => {
      const { getByText } = render(
        Handout(
          { ...happyPathData, abgabeArt: "ausdrucken", plz: "10629" },
          "",
        ),
      );
      expect(
        getByText("So schicken Sie den Antrag ins Amtsgericht"),
      ).toBeInTheDocument();
      const amtsgerichtText = (
        dynamicSteps["ausdrucken"].at(-1)!.value as (
          validAmtsgericht: boolean,
        ) => string
      )(true);
      expect(getByText(amtsgerichtText)).toBeInTheDocument();
    });

    it("should render the correct copy if the user doesn't have a valid Amtsgericht yet", () => {
      const { getByText } = render(
        Handout({ ...happyPathData, abgabeArt: "ausdrucken" }, ""),
      );
      const amtsgerichtText = (
        dynamicSteps["ausdrucken"].at(-1)!.value as (
          validAmtsgericht: boolean,
        ) => string
      )(false);
      expect(getByText(amtsgerichtText)).toBeInTheDocument();
    });
  });

  describe("Online Submission", () => {
    it("should render the correct copy for an online submission", () => {
      const { getByText } = render(
        Handout({ ...happyPathData, abgabeArt: "online" }, ""),
      );
      const amtsgerichtText = dynamicSteps["online"].at(-1)!.value as string;
      expect(getByText(amtsgerichtText)).toBeInTheDocument();
    });
  });
});