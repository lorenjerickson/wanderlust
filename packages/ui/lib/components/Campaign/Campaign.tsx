import { useMemo } from "react";
import { Panel, WorkspaceRegion } from "../Panel";
import styles from "./Campaign.module.scss";

export type CampaignProps = {
  id?: string;
  region?: WorkspaceRegion;
  className?: string;
  statusMessage?: string;
};

export function Campaign(props: CampaignProps) {
  const { id = "campaign", region, className, statusMessage } = props;

  const panelClassName = useMemo(() => {
    return [styles.panelView, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <Panel
      id={id}
      title="Campaign"
      region={region}
      className={panelClassName}
      statusMessage={statusMessage}
    />
  );
}
