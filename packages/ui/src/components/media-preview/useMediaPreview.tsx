import React from 'react';
import { MediaAsset } from "./types";
import { ImagePreview } from './ImagePreview';
import { VideoPreview } from './VideoPreview';
import { AudioPreview } from './AudioPreview';


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