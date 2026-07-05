import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Panel } from "../Panel";
import { Workspace } from "./Workspace";

const addPanelMock = vi.fn();

vi.mock("dockview-react", () => {
  return {
    DockviewReact: ({ onReady, className, components }: any) => {
      React.useEffect(() => {
        onReady?.({
          api: {
            addPanel: addPanelMock,
          },
        });
      }, [onReady]);

      const panelComponents = Object.values(components);
      const MockPanel = panelComponents[0] as React.ComponentType<any>;

      return (
        <div data-testid="mock-dockview" className={className}>
          {MockPanel ? (
            <MockPanel
              api={{ title: "Mock panel" }}
              params={{ id: "mock", title: "Mock panel", statusMessage: "Mock status" }}
            />
          ) : null}
        </div>
      );
    },
  };
});

describe("Workspace", () => {
  it("renders the shell and default border layout regions", () => {
    addPanelMock.mockClear();

    render(<Workspace title="App Workspace" />);

    expect(screen.getByText("App Workspace")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-shell")).toBeInTheDocument();
    expect(addPanelMock).toHaveBeenCalledTimes(5);
    expect(addPanelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "workspace-left",
        component: "workspace-left",
      })
    );
  });

  it("accepts Panel children as dockable components", () => {
    addPanelMock.mockClear();

    render(
      <Workspace
        title="Custom Workspace"
      >
        <Panel id="workspace-left-custom" title="Left" region="left">
          Left content
        </Panel>
        <Panel id="workspace-middle" title="Center" region="middle-center">
          Center content
        </Panel>
      </Workspace>
    );

    expect(addPanelMock).toHaveBeenCalledTimes(2);
    expect(addPanelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "workspace-middle",
        title: "Center",
        position: {
          referencePanel: "workspace-left-custom",
          direction: "right",
        },
      })
    );
  });

  it("rejects non-Panel children", () => {
    expect(() => {
      render(
        <Workspace>
          <div>Invalid child</div>
        </Workspace>
      );
    }).toThrowError("Workspace only accepts Panel components as dockable children.");
  });
});
