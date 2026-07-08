import { AudioPreview } from "./components/AudioPreview";
import { ImagePreview } from "./components/ImagePreview";
import { MediaAsset } from "./types";
import { VideoPreview } from "./components/VideoPreview";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMediaPreview({ asset }: { asset: MediaAsset<any> }) {
  if (asset.type === "image") {
    return <ImagePreview asset={asset} />;
  } else if (asset.type === "video") {
    return <VideoPreview asset={asset} />;
  } else if (asset.type === "audio") {
    return <AudioPreview asset={asset} />;
  } else {
    return <div />;
  }
}
