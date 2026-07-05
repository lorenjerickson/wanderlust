import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Encounter } from "./Encounter";

describe("Encounter", () => {
  it("renders its placeholder content", () => {
    render(<Encounter />);

    expect(screen.getByText("Not Implemented")).toBeInTheDocument();
  });
});
