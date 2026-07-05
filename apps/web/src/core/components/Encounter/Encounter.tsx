import { useMemo } from "react";
import { Panel, WorkspaceRegion } from "../Panel";
import styles from "./Encounter.module.scss";

export type EncounterProps = {
  id?: string;
  region?: WorkspaceRegion;
  className?: string;
  statusMessage?: string;
};

export function Encounter(props: EncounterProps) {
  const { id = "encounter", region, className, statusMessage } = props;

  const panelClassName = useMemo(() => {
    return [styles.panelView, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <Panel
      id={id}
      title="Encounter"
      region={region}
      className={panelClassName}
      statusMessage={statusMessage}
    />
  );
}
