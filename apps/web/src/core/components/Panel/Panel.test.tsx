import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Panel } from "./Panel";

afterEach(() => {
  cleanup();
});

describe("Panel", () => {
  it("renders title, body, and optional footer", () => {
    render(
      <Panel id="panel-a" title="Inspector" statusMessage="Connected">
        <div>Panel body content</div>
      </Panel>
    );

    expect(screen.getByText("Inspector")).toBeTruthy();
    expect(screen.getByText("Panel body content")).toBeTruthy();
    expect(screen.getByText("Connected")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("hides the title header when docked", () => {
    render(
      <Panel id="panel-a" title="Inspector" isFloating={false}>
        <div>Panel body content</div>
      </Panel>
    );

    expect(screen.queryByText("Inspector")).toBeNull();
    expect(screen.getByText("Panel body content")).toBeTruthy();
  });
});
