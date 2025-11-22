import { MediaCollection } from "../../components/MediaCollection/MediaCollection";
import { MediaToolbar } from "../../components/MediaToolbar/MediaToolbar";
import { StyledMediaApp } from "./MediaApp.styles";

export function MediaApp() {
  return (
    <StyledMediaApp>
      <MediaToolbar />
      <MediaCollection />
    </StyledMediaApp>
  );
}
