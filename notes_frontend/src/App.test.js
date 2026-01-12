import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders notes list heading", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  const heading = screen.getByRole("heading", { name: /notes/i });
  expect(heading).toBeInTheDocument();
});
