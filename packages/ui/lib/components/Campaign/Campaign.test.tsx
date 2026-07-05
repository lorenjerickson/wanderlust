import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Campaign } from "./Campaign";

describe("Campaign", () => {
  it("renders a Panel with the correct title", () => {
    render(<Campaign />);

    expect(screen.getByText("Campaign")).toBeInTheDocument();
  });
});
