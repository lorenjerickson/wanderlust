import { useMemo } from "react";
import { Panel, WorkspaceRegion } from "../Panel";
import styles from "./Actors.module.scss";

export type ActorsProps = {
  id?: string;
  region?: WorkspaceRegion;
  className?: string;
  statusMessage?: string;
};

export function Actors(props: ActorsProps) {
  const { id = "actors", region, className, statusMessage } = props;

  const panelClassName = useMemo(() => {
    return [styles.panelView, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <Panel
      id={id}
      title="Actors"
      region={region}
      className={panelClassName}
      statusMessage={statusMessage}
    />
  );
}
