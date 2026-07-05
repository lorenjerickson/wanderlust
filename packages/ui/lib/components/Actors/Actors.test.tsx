import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Actors } from "./Actors";

describe("Actors", () => {
  it("renders a Panel with the correct title", () => {
    render(<Actors />);

    expect(screen.getByText("Actors")).toBeInTheDocument();
  });
});
