import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Compendium } from "./Compendium";

describe("Compendium", () => {
  it("renders its placeholder content", () => {
    render(<Compendium />);

    expect(screen.getByText("Not Implemented")).toBeInTheDocument();
  });
});
