import { AudioMetadata, MediaAsset } from "../types";

export function AudioPreview({ asset }: { asset: MediaAsset<AudioMetadata> }) {
    return <audio controls src={asset.url} className="audioPreview" />;
}
