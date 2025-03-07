import { MediaAsset, ImageMetadata } from "../types";

export function ImagePreview({ asset }: { asset: MediaAsset<ImageMetadata> }) {
    return <img src={asset.url} alt="" className="imagePreview" />
}