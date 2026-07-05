import { useMemo } from "react";
import { Panel, WorkspaceRegion } from "../Panel";
import styles from "./ActorDetail.module.scss";

export type ActorDetailProps = {
  id?: string;
  region?: WorkspaceRegion;
  className?: string;
  statusMessage?: string;
};

export function ActorDetail(props: ActorDetailProps) {
  const { id = "actor-detail", region, className, statusMessage } = props;

  const panelClassName = useMemo(() => {
    return [styles.panelView, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <Panel
      id={id}
      title="Actor Detail"
      region={region}
      className={panelClassName}
      statusMessage={statusMessage}
    />
  );
}
