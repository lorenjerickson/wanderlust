import classes from './ImagePreview.module.scss';

type ImagePreviewProps = {
    filename: string
}

export default function ImagePreview({ filename }: ImagePreviewProps) {
    return (
        <div className={classes.preview}>
            <img className={classes.image} src={`http://localhost:3000/static/media/${filename}`} alt={filename} />
        </div>
    )
}