
export interface MediaAsset<T extends MediaMetadata> {
    id: string;
    type: string;
    url: string;
    filename: string;
    metadata: T | unknown;
}

type MediaMetadata = ImageMetadata | VideoMetadata | AudioMetadata;

export interface VideoMetadata {
    length: number;
    codec: string;
    framerate: number;
    bitrate: number;
    resolution: {
        width: number;
        height: number;
    };
}


export interface ImageMetadata {
    width: number;
    height: number;
    size: number;
    format: string;
    aspectRation: string;
    resolution: {
        width: number;
        height: number;
    };
}


export interface AudioMetadata {
    length: number;
    codec: string;
    bitrate: number;
}

