import { MediaAsset, VideoMetadata } from "./types";

export function VideoPreview({ asset }: { asset: MediaAsset<VideoMetadata> }) {
    return <video controls src={asset.url} className="videoPreview" />;
}
