import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

export const renderWithRouter = (reactNode: React.ReactNode, route = "/") =>
  render(<MemoryRouter initialEntries={[route]}>{reactNode}</MemoryRouter>);
