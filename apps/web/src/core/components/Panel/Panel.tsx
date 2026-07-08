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
  isFloating?: boolean;
  children?: ReactNode;
  className?: string;
};

type WorkspacePanelComponent = React.FC<PanelProps> & {
  __WORKSPACE_PANEL__: true;
};

const PanelBase: React.FC<PanelProps> = ({
  title,
  statusMessage,
  isFloating = true,
  children,
  className,
}) => {
  const rootClassName = useMemo(() => {
    return [styles.panel, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <section className={rootClassName} data-testid="workspace-panel">
      {isFloating ? (
        <header className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>{title}</h3>
        </header>
      ) : null}
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
