import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EncounterMap } from "./EncounterMap";

describe("EncounterMap", () => {
  it("renders its placeholder content", () => {
    render(<EncounterMap />);

    expect(screen.getByText("Not Implemented")).toBeInTheDocument();
  });
});
