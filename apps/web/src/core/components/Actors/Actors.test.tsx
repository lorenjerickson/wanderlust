import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Actors } from "./Actors";

describe("Actors", () => {
  it("renders its placeholder content", () => {
    render(<Actors />);

    expect(screen.getByText("Not Implemented")).toBeInTheDocument();
  });
});
