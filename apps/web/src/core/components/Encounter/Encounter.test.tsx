import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Encounter } from "./Encounter";

describe("Encounter", () => {
  it("renders a Panel with the correct title", () => {
    render(<Encounter />);

    expect(screen.getByText("Encounter")).toBeInTheDocument();
  });
});
