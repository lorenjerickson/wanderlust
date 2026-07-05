import React, { ReactNode, useMemo } from "react";
import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import {
  isWorkspacePanelElement,
  Panel,
  WorkspacePanelElement,
  WorkspaceRegion,
} from "../Panel";
import styles from "./Workspace.module.scss";

export type WorkspaceProps = {
  className?: string;
  themeClassName?: string;
  title?: string;
  children?: WorkspacePanelElement | WorkspacePanelElement[];
};

type WorkspacePanelParams = {
  id: string;
  title: string;
  statusMessage?: string;
  content?: ReactNode;
};

type RegionDirection = "left" | "right" | "above" | "below";

type PanelRegionConfig = {
  id: string;
  title: string;
  statusMessage?: string;
  region: WorkspaceRegion;
  content?: ReactNode;
};

type DockviewPanelApiLike = {
  close?: () => void;
  moveTo?: (options: unknown) => void;
  group?: {
    api?: {
      maximizeGroup?: () => void;
      exitMaximizedGroup?: () => void;
      setSize?: (size: { width?: number; height?: number }) => void;
      toFloating?: () => void;
    };
  };
};

const DefaultPanel = (props: IDockviewPanelProps<WorkspacePanelParams>) => {
  const panelApi = props.api as unknown as DockviewPanelApiLike;

  const handleClose = () => {
    panelApi.close?.();
  };

  const handleMaximize = () => {
    panelApi.group?.api?.maximizeGroup?.();
  };

  const handleMinimize = () => {
    if (panelApi.group?.api?.exitMaximizedGroup) {
      panelApi.group.api.exitMaximizedGroup();
      return;
    }

    panelApi.group?.api?.setSize?.({ height: 140 });
  };

  const handleDetach = () => {
    if (panelApi.group?.api?.toFloating) {
      panelApi.group.api.toFloating();
      return;
    }

    panelApi.moveTo?.({ floating: true });
  };

  return (
    <Panel
      id={props.params.id}
      title={props.params.title}
      statusMessage={props.params.statusMessage}
      onDetach={handleDetach}
      onMinimize={handleMinimize}
      onMaximize={handleMaximize}
      onClose={handleClose}
    >
      {props.params.content}
    </Panel>
  );
};

const DEFAULT_PANELS: PanelRegionConfig[] = [
  {
    id: "workspace-left",
    title: "Left",
    statusMessage: "Navigation ready",
    region: "left",
    content: <p className={styles.workspaceBodyText}>Navigation and project tree</p>,
  },
  {
    id: "workspace-middle-top",
    title: "Middle Top",
    statusMessage: "Top region active",
    region: "middle-top",
    content: <p className={styles.workspaceBodyText}>Middle top dock region</p>,
  },
  {
    id: "workspace-middle-center",
    title: "Middle Center",
    statusMessage: "Editing",
    region: "middle-center",
    content: <p className={styles.workspaceBodyText}>Primary editing surface</p>,
  },
  {
    id: "workspace-middle-bottom",
    title: "Middle Bottom",
    statusMessage: "Logs streaming",
    region: "middle-bottom",
    content: <p className={styles.workspaceBodyText}>Diagnostics and logs</p>,
  },
  {
    id: "workspace-right",
    title: "Right",
    statusMessage: "Inspector synced",
    region: "right",
    content: <p className={styles.workspaceBodyText}>Inspector and metadata</p>,
  },
];

const REGION_PRIORITY: WorkspaceRegion[] = [
  "left",
  "middle-center",
  "right",
  "middle-top",
  "middle-bottom",
];

const REGION_POSITION: Partial<Record<WorkspaceRegion, { referenceRegion: WorkspaceRegion; direction: RegionDirection }>> = {
  "middle-center": { referenceRegion: "left", direction: "right" },
  right: { referenceRegion: "middle-center", direction: "right" },
  "middle-top": { referenceRegion: "middle-center", direction: "above" },
  "middle-bottom": { referenceRegion: "middle-center", direction: "below" },
};

function mapPanelElementToConfig(panel: WorkspacePanelElement): PanelRegionConfig {
  const props = panel.props;

  return {
    id: props.id,
    title: props.title,
    statusMessage: props.statusMessage,
    content: props.children,
    region: props.region ?? "middle-center",
  };
}

function normalizePanels(children: WorkspaceProps["children"]): PanelRegionConfig[] {
  if (!children) {
    return DEFAULT_PANELS;
  }

  const nodes = React.Children.toArray(children);
  const normalized: PanelRegionConfig[] = [];

  nodes.forEach((node) => {
    if (!isWorkspacePanelElement(node)) {
      throw new Error("Workspace only accepts Panel components as dockable children.");
    }

    normalized.push(mapPanelElementToConfig(node));
  });

  return normalized;
}

function getPanelPosition(
  panel: PanelRegionConfig,
  firstPanelByRegion: Partial<Record<WorkspaceRegion, string>>
): { referencePanel: string; direction?: RegionDirection } | undefined {
  const firstPanelInRegion = firstPanelByRegion[panel.region];
  if (firstPanelInRegion && firstPanelInRegion !== panel.id) {
    return { referencePanel: firstPanelInRegion };
  }

  const positionConfig = REGION_POSITION[panel.region];
  if (!positionConfig) {
    return undefined;
  }

  const referencePanel = firstPanelByRegion[positionConfig.referenceRegion];
  if (!referencePanel) {
    return undefined;
  }

  return {
    referencePanel,
    direction: positionConfig.direction,
  };
}

function getPanelComponents(panels: PanelRegionConfig[]): Record<string, React.FC<IDockviewPanelProps<WorkspacePanelParams>>> {
  return panels.reduce<Record<string, React.FC<IDockviewPanelProps<WorkspacePanelParams>>>>((acc, panel) => {
    acc[panel.id] = DefaultPanel;
    return acc;
  }, {});
}

export function Workspace(props: WorkspaceProps) {
  const {
    className,
    themeClassName = "dockview-theme-abyss",
    title = "Workspace",
    children,
  } = props;

  const panels = useMemo(() => normalizePanels(children), [children]);

  const panelComponents = useMemo(() => {
    return getPanelComponents(panels);
  }, [panels]);

  const dockviewClassName = useMemo(() => {
    return [styles.workspaceDockview, themeClassName].filter(Boolean).join(" ");
  }, [themeClassName]);

  const rootClassName = useMemo(() => {
    return [styles.workspaceShell, className].filter(Boolean).join(" ");
  }, [className]);

  const handleReady = (event: DockviewReadyEvent) => {
    const firstPanelByRegion: Partial<Record<WorkspaceRegion, string>> = {};
    const orderedPanels = [...panels].sort((left, right) => {
      return REGION_PRIORITY.indexOf(left.region) - REGION_PRIORITY.indexOf(right.region);
    });

    orderedPanels.forEach((panel) => {
      if (!firstPanelByRegion[panel.region]) {
        firstPanelByRegion[panel.region] = panel.id;
      }

      const position = getPanelPosition(panel, firstPanelByRegion);

      event.api.addPanel({
        id: panel.id,
        component: panel.id,
        title: panel.title,
        params: {
          id: panel.id,
          title: panel.title,
          statusMessage: panel.statusMessage,
          content: panel.content,
        },
        ...(position ? { position } : {}),
      });
    });
  };

  return (
    <section className={rootClassName} data-testid="workspace-shell">
      <header className={styles.workspaceToolbar}>
        <span className={styles.workspaceDot} aria-hidden="true" />
        <span className={styles.workspaceTitle}>{title}</span>
      </header>
      <div className={styles.workspaceCanvas}>
        <DockviewReact
          className={dockviewClassName}
            components={panelComponents}
          onReady={handleReady}
        />
      </div>
    </section>
  );
}
