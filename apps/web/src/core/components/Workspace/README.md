# Workspace

`Workspace` is a React functional component that provides an application shell with dockable regions powered by [Dockview](https://dockview.dev/docs/overview/quickstart).

## Features

- Dockable panel layout via `dockview-react`
- Default border layout shell with 5 regions: left, middle-top, middle-center, middle-bottom, right
- Accepts only `Panel` components as dockable units
- SASS module with class aliases for grouped Tailwind utilities
- Included unit tests and Storybook stories

## Basic Usage

```tsx
import { Panel, Workspace } from "@/core/components";

export function App() {
  return (
    <div style={{ height: "100vh", padding: "1rem" }}>
      <Workspace title="Application Workspace">
        <Panel id="left" title="Left" region="left">
          Navigation
        </Panel>
        <Panel id="center" title="Center" region="middle-center">
          Main content
        </Panel>
        <Panel id="right" title="Right" region="right">
          Inspector
        </Panel>
      </Workspace>
    </div>
  );
}
```

## Custom Panels

```tsx
import { Panel, Workspace } from "@/core/components";

export function App() {
  return (
    <Workspace title="Media Workspace">
      <Panel id="assets" title="Assets" region="left" statusMessage="Library synced">
        Browse and manage uploaded media.
      </Panel>
      <Panel id="canvas" title="Canvas" region="middle-center" statusMessage="Ready">
        Main editing area.
      </Panel>
      <Panel id="activity" title="Activity" region="middle-bottom" statusMessage="Live">
        Recent actions and events.
      </Panel>
      <Panel id="inspector" title="Inspector" region="right" statusMessage="Selection tracked">
        Metadata and controls.
      </Panel>
    </Workspace>
  );
}
```

## Props

- `title?: string`
  - Toolbar title text.
  - Default: `"Workspace"`

- `className?: string`
  - Optional additional class for the root shell element.

- `themeClassName?: string`
  - Dockview theme class name.
  - Default: `"dockview-theme-abyss"`

- `children?: Panel | Panel[]`
  - Workspace accepts only `Panel` elements as dockable children.
  - Default: border layout with left/middle-top/middle-center/middle-bottom/right.

### `Panel`

- `id: string` (required)
- `title: string` (required)
- `region?: "left" | "middle-top" | "middle-center" | "middle-bottom" | "right"`
- `statusMessage?: string`
- `children?: ReactNode`

## Development Notes

- Storybook stories:
  - `Default`
  - `CustomPanels`
- Unit tests cover:
  - Rendering shell title + default border layout region initialization
  - Panel-only child enforcement
  - Custom regional layout behavior

## File Map

- Component: `packages/ui/lib/components/Workspace/Workspace.tsx`
- Styles: `packages/ui/lib/components/Workspace/Workspace.module.scss`
- Tests: `packages/ui/lib/components/Workspace/Workspace.test.tsx`
- Stories: `packages/ui/lib/components/Workspace/Workspace.stories.tsx`
- Panel: `packages/ui/lib/components/Panel/Panel.tsx`
- Panel styles: `packages/ui/lib/components/Panel/Panel.module.scss`
