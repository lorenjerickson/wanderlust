import { Image } from "@mantine/core"
import { MediaAsset, ImageMetadata } from "./types"

export function ImagePreview({ asset }: { asset: MediaAsset<ImageMetadata> }) {
  return <Image src={asset.url} alt="" className="imagePreview" />
}
