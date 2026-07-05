import { useMemo } from "react";
import { Panel, WorkspaceRegion } from "../Panel";
import styles from "./Chat.module.scss";

export type ChatProps = {
  id?: string;
  region?: WorkspaceRegion;
  className?: string;
  statusMessage?: string;
};

export function Chat(props: ChatProps) {
  const { id = "chat", region, className, statusMessage } = props;

  const panelClassName = useMemo(() => {
    return [styles.panelView, className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <Panel
      id={id}
      title="Chat"
      region={region}
      className={panelClassName}
      statusMessage={statusMessage}
    />
  );
}
