import { useMemo } from "react";
import { Panel, WorkspaceRegion } from "../Panel";
import styles from "./Compendium.module.scss";

export type CompendiumProps = {
  id?: string;
  region?: WorkspaceRegion;
  className?: string;
  statusMessage?: string;
};

export function Compendium(props: CompendiumProps) {
  const { id = "compendium", region, className, statusMessage } = props;

  const panelClassName = useMemo(() => {
    return [styles.panelView, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <Panel
      id={id}
      title="Compendium"
      region={region}
      className={panelClassName}
      statusMessage={statusMessage}
    />
  );
}
