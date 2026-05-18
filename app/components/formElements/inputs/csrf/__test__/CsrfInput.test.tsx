import { render } from "@testing-library/react";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

vi.mock("react-router", async () => ({
  useRouteLoaderData: vi.fn().mockReturnValue({ csrf: "mocked-csrf-token" }),
}));

describe("CsrfInput", () => {
  it("renders the hidden input with the csrf token", () => {
    const { getByTestId } = render(<CsrfInput />);
    const csrf = getByTestId(CSRFKey);
    expect(csrf).toBeInTheDocument();
    expect(csrf).toHaveValue("mocked-csrf-token");
    expect(csrf).toHaveAttribute("type", "hidden");
  });
});
