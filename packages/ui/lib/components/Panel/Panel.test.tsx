import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Panel } from "./Panel";

afterEach(() => {
  cleanup();
});

describe("Panel", () => {
  it("renders title, controls, body, and optional footer", () => {
    render(
      <Panel id="panel-a" title="Inspector" statusMessage="Connected">
        <div>Panel body content</div>
      </Panel>
    );

    expect(screen.getByText("Inspector")).toBeInTheDocument();
    expect(screen.getByText("Panel body content")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Detach panel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Minimize panel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Maximize panel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close panel" })).toBeInTheDocument();
  });

  it("invokes control handlers", () => {
    const onDetach = vi.fn();
    const onMinimize = vi.fn();
    const onMaximize = vi.fn();
    const onClose = vi.fn();

    render(
      <Panel
        id="panel-b"
        title="Editor"
        onDetach={onDetach}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Detach panel" }));
    fireEvent.click(screen.getByRole("button", { name: "Minimize panel" }));
    fireEvent.click(screen.getByRole("button", { name: "Maximize panel" }));
    fireEvent.click(screen.getByRole("button", { name: "Close panel" }));

    expect(onDetach).toHaveBeenCalledTimes(1);
    expect(onMinimize).toHaveBeenCalledTimes(1);
    expect(onMaximize).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
