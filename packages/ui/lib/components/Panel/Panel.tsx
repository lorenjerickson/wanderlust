import React, { ReactNode, useMemo } from "react";
import styles from "./Panel.module.scss";

export type WorkspaceRegion =
  | "left"
  | "middle-top"
  | "middle-center"
  | "middle-bottom"
  | "right";

export type PanelProps = {
  id: string;
  title: string;
  region?: WorkspaceRegion;
  statusMessage?: string;
  children?: ReactNode;
  className?: string;
  onDetach?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
};

type WorkspacePanelComponent = React.FC<PanelProps> & {
  __WORKSPACE_PANEL__: true;
};

const PanelBase: React.FC<PanelProps> = ({
  title,
  statusMessage,
  children,
  className,
  onDetach,
  onMinimize,
  onMaximize,
  onClose,
}) => {
  const rootClassName = useMemo(() => {
    return [styles.panel, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <section className={rootClassName} data-testid="workspace-panel">
      <header className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{title}</h3>
        <div className={styles.panelControls}>
          <button type="button" className={styles.panelControlButton} onClick={onDetach} aria-label="Detach panel">
            Detach
          </button>
          <button type="button" className={styles.panelControlButton} onClick={onMinimize} aria-label="Minimize panel">
            Min
          </button>
          <button type="button" className={styles.panelControlButton} onClick={onMaximize} aria-label="Maximize panel">
            Max
          </button>
          <button type="button" className={styles.panelControlButton} onClick={onClose} aria-label="Close panel">
            Close
          </button>
        </div>
      </header>
      <div className={styles.panelBody}>{children}</div>
      {statusMessage ? <footer className={styles.panelFooter}>{statusMessage}</footer> : null}
    </section>
  );
};

export const Panel = PanelBase as WorkspacePanelComponent;

Panel.__WORKSPACE_PANEL__ = true;
Panel.displayName = "Panel";

export type WorkspacePanelElement = React.ReactElement<PanelProps, typeof Panel>;

export function isWorkspacePanelElement(value: ReactNode): value is WorkspacePanelElement {
  if (!React.isValidElement(value)) {
    return false;
  }

  const typeValue = value.type as { __WORKSPACE_PANEL__?: boolean };
  return typeValue.__WORKSPACE_PANEL__ === true;
}
