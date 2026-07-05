import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActorDetail } from "./ActorDetail";

describe("ActorDetail", () => {
  it("renders a Panel with the correct title", () => {
    render(<ActorDetail />);

    expect(screen.getByText("Actor Detail")).toBeInTheDocument();
  });
});
