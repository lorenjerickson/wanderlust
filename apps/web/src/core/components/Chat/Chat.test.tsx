import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chat } from "./Chat";

describe("Chat", () => {
  it("renders a Panel with the correct title", () => {
    render(<Chat />);

    expect(screen.getByText("Chat")).toBeInTheDocument();
  });
});
