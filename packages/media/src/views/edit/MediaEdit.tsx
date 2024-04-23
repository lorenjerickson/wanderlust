import { lazy, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ImagePreview from '../../components/image/ImagePreview';
import classes from './MediaEdit.module.scss';
import { useMedia } from '../../hooks/useMedia';

enum InteractionMode {
    None,
    Create,
    Edit,
}

type MediaModel = {
    id: number;
    name: string;
    url: string;
    type: string;
    filename: string;
    mimetype: string;
    size: number;
    tags: string[];
    created: Date;
    modified: Date;
    detail: ImageModel | AudioModel | VideoModel;
}

type ImageModel = {
    width: number;
    height: number;
    aspectRatio: number;
    format: string;
    resolution: string;
    colorDepth: number;
    compression: number;
    quality: number;
}

type AudioModel = {
    duration: number;
    channels: number;
    sampleRate: number;
    codec: string;
    bitrate: number;
}

type VideoModel = {
    codec: string;
    duration: number;
    width: number;
    height: number;
    aspectRatio: number;
    frameRate: number;
    bitrate: number;
}

const VideDetail = lazy(() => import('../../components/video/VideoDetail'));
const AudioDetail = lazy(() => import('../../components/audio/AudioDetail'));
const ImageDetail = lazy(() => import('../../components/image/ImageDetail'));

export default function MediaEdit() {
    const location = useLocation();
    const params = useParams();
    const searcParams = new URLSearchParams(location.search);
    const filename = searcParams.get('filename');
    const type = searcParams.get('type');
    const [data, setData] = useState<MediaModel>();

    const { upsertOne, getOne } = useMedia();

    const [mode, setMode] = useState(InteractionMode.None);
    const baseType = useMemo(() => {
        return type?.split('/')[0];
    }, [type])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { };

    useEffect(() => {
        getOne(params.id as string).then(setData);
    }, [params])

    return (
        <div className={classes.edit}>
            {mode === InteractionMode.Create ? <h3>Create Media</h3> : <h3>Edit Media</h3>}
            <form action="" onSubmit={handleSubmit}>``
                <div className={classes.preview}>
                    <h4>Preview</h4>
                    {baseType === 'image' && <ImagePreview filename={filename as string} />}
                </div>
                <div className={classes.detail}>
                    <h4>General</h4>

                </div>
                <div className={classes.detail}>
                    <h4>Detail</h4>
                    {type === 'image' && <ImageDetail />}
                    {type === 'audio' && <AudioDetail />}
                    {type === 'video' && <VideDetail />}
                </div>
                <div className={classes.tags}>
                    <h4>Tags</h4>
                </div>
                <div className={classes.actions}>
                    <button type="submit">Save</button>
                    <button type="reset">Cancel</button>
                </div>
            </form>
        </div>
    )
}