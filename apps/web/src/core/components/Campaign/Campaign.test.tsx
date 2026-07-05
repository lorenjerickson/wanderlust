import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Campaign } from "./Campaign";

describe("Campaign", () => {
  it("renders its placeholder content", () => {
    render(<Campaign />);

    expect(screen.getByText("Not Implemented")).toBeInTheDocument();
  });
});
