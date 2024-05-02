import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Dropzone } from '@wanderlust/ui'

import '@mantine/dropzone/styles.css';
import { useState } from 'react';
import FileDetail from '../file/FileDetail.';
import classes from './MediaUpload.module.scss';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { Card, Image } from 'antd';

export default function MediaUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("https://placehold.co/600x400?text=");
    const { uploadFile } = useMediaUpload();
    const navigate = useNavigate();

    const handleDrop = (file: File) => {
        if (file) {
            setFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClear = () => {
        setFile(null);
        setPreviewUrl("https://placehold.co/600x400?text=");
    }

    const handleUpload = () => {
        if (file) {
            uploadFile(file).then(res => res.json()).then(data => {
                console.log(data);
                navigate(`../edit/0?filename=${data.file.filename}&type=${data.file.mimetype}`)
                handleClear();
            });
        }
    }

    const preview = <Image
        src={previewUrl}
        height={400}
        alt="Norway"
        style={{ objectFit: 'contain', borderRadius: 'var(--mantine-radius-md)' }}
    />

    const dropzone = <Dropzone />;

    return (
        <div className={classes.media}>
            <div className={classes.upload}>
                <div className={classes.details}>
                    <Card>
                        <div className="previewUpload">
                            {file ? preview : dropzone}
                        </div>
                        <div className="info">
                            {file && <FileDetail file={file as File} onClear={handleClear} onUpload={handleUpload} />}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}