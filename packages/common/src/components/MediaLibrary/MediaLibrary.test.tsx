import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaLibrary } from "./MediaLibrary";

describe("MediaLibrary", () => {
  it("renders its placeholder content", () => {
    render(<MediaLibrary />);

    expect(screen.getByText("Not Implemented")).toBeInTheDocument();
  });
});
