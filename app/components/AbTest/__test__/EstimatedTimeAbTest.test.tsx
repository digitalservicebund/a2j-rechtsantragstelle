import { render, screen } from "@testing-library/react";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { useLocation } from "react-router";
import { vi, type Mock } from "vitest";
import { EstimatedTimeAbTest } from "../EstimatedTimeAbTest";

vi.mock("posthog-js/react", () => {
  return {
    useFeatureFlagVariantKey: vi.fn(),
  };
});
vi.mock("react-router", () => {
  return {
    useLocation: vi.fn(),
  };
});

const useFeatureFlagVariantKeyMock = useFeatureFlagVariantKey as Mock;
const useLocationMock = useLocation as Mock;

describe("EstimatedTimeAbTest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render estimated time when on PKH flow start page and in test group", () => {
    useFeatureFlagVariantKeyMock.mockReturnValue("test");
    useLocationMock.mockReturnValue({
      pathname: "/prozesskostenhilfe/formular/start/start",
    });
    render(<EstimatedTimeAbTest />);
    expect(screen.getByText("Geschätzte Zeit: 20 Minuten")).toBeInTheDocument();
    expect(screen.getByTestId("TimerOutlinedIcon")).toBeInTheDocument();
  });

  it("should not render estimated time when not on PKH flow start page", () => {
    useFeatureFlagVariantKeyMock.mockReturnValue("test");
    useLocationMock.mockReturnValue({
      pathname: "/prozesskostenhilfe/formular/other",
    });
    expect(
      screen.queryByText("Geschätzte Zeit: 20 Minuten"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("TimerOutlinedIcon")).not.toBeInTheDocument();
  });

  it("should not render estimated time when in control group", () => {
    useFeatureFlagVariantKeyMock.mockReturnValue("control");
    useLocationMock.mockReturnValue({
      pathname: "/prozesskostenhilfe/formular/start/start",
    });
    expect(
      screen.queryByText("Geschätzte Zeit: 20 Minuten"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("TimerOutlinedIcon")).not.toBeInTheDocument();
  });

  it("should not render estimated time when variantKey is undefined", () => {
    useFeatureFlagVariantKeyMock.mockReturnValue(undefined);
    useLocationMock.mockReturnValue({
      pathname: "/prozesskostenhilfe/formular/start/start",
    });
    expect(
      screen.queryByText("Geschätzte Zeit: 20 Minuten"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("TimerOutlinedIcon")).not.toBeInTheDocument();
  });
});
