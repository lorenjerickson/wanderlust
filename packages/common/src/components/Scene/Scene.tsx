import { useMemo } from "react";
import { Panel, WorkspaceRegion } from "../Panel";
import styles from "./Scene.module.scss";

export type SceneProps = {
  id?: string;
  region?: WorkspaceRegion;
  className?: string;
  statusMessage?: string;
};

export function Scene(props: SceneProps) {
  const { id = "scene", region, className, statusMessage } = props;

  const panelClassName = useMemo(() => {
    return [styles.panelView, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <Panel
      id={id}
      title="Scene"
      region={region}
      className={panelClassName}
      statusMessage={statusMessage}
    />
  );
}
