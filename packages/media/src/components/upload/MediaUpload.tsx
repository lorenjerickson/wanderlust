import { Card, Group, Image, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, FileRejection } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import '@mantine/dropzone/styles.css';
import { useState } from 'react';
import FileDetail from '../file/FileDetail.';
import classes from './MediaUpload.module.scss';
import { useMediaUpload } from '../../hooks/useMediaUpload';

export default function MediaUpload(props: Partial<DropzoneProps>) {
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

    const dropzone = <Dropzone
        onDrop={(files: File[]) => handleDrop(files[0] as File)}
        onReject={(files: FileRejection[]) => console.error('Rejected files:', files)}
        maxSize={100 * 1024 ** 2}
        {...props}
        accept={{
            'image/*': [],
            'audio/*': [],
            "video/*": []
        }}
    >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
                <IconUpload
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                    stroke={1.5}
                />
            </Dropzone.Accept>
            <Dropzone.Reject>
                <IconX
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                    stroke={1.5}
                />
            </Dropzone.Reject>
            <Dropzone.Idle>
                <IconPhoto
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                    stroke={1.5}
                />
            </Dropzone.Idle>

            <div>
                <Text size="xl" inline>
                    Drag a media file here, or click to select one
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                    Attach only one file. Each file should not exceed 100mb.
                </Text>
            </div>
        </Group>
    </Dropzone>;

    return (
        <div className={classes.media}>
            <div className={classes.upload}>
                <div className={classes.details}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            {file ? preview : dropzone}
                        </Card.Section>

                        <Card.Section>
                            {file && <FileDetail file={file as File} onClear={handleClear} onUpload={handleUpload} />}
                        </Card.Section>

                    </Card>
                </div>

            </div>
        </div>
    )
}