import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Scene } from "./Scene";

describe("Scene", () => {
  it("renders a Panel with the correct title", () => {
    render(<Scene />);

    expect(screen.getByText("Scene")).toBeInTheDocument();
  });
});
