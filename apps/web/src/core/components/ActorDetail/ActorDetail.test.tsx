import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActorDetail } from "./ActorDetail";

describe("ActorDetail", () => {
  it("renders its placeholder content", () => {
    render(<ActorDetail />);

    expect(screen.getByText("Not Implemented")).toBeInTheDocument();
  });
});
