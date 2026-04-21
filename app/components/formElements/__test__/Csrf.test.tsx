import { render } from "@testing-library/react";
import { Csrf } from "~/components/formElements/Csrf";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

vi.mock("react-router", async () => ({
  useRouteLoaderData: vi.fn().mockReturnValue({ csrf: "mocked-csrf-token" }),
}));

describe("Csrf", () => {
  it("renders the hidden input with the csrf token", () => {
    const { getByTestId } = render(<Csrf />);
    const csrf = getByTestId(CSRFKey);
    expect(csrf).toBeInTheDocument();
    expect(csrf).toHaveValue("mocked-csrf-token");
    expect(csrf).toHaveAttribute("type", "hidden");
  });
});
