import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Compendium } from "./Compendium";

describe("Compendium", () => {
  it("renders a Panel with the correct title", () => {
    render(<Compendium />);

    expect(screen.getByText("Compendium")).toBeInTheDocument();
  });
});
