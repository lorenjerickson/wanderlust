import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatLog } from "./ChatLog";

describe("ChatLog", () => {
  it("renders its placeholder content", () => {
    render(<ChatLog />);

    expect(screen.getByText("Not Implemented")).toBeInTheDocument();
  });
});
