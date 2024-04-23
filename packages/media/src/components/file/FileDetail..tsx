import { Text, Button, Box } from '@mantine/core';

import classes from './FileDetail.module.scss';
import { useMemo } from 'react';

export default function FileDetail({ file, onClear, onUpload }: { file: File; onClear: () => void; onUpload: () => void }) {
    const type = useMemo(() => {
        if (file) {
            return file.type.split('/')[0];
        } else return "";
    }, [file]);

    const handleClear = () => onClear();

    const handleUpload = () => onUpload();

    return (
        <div className={classes.mediaDetatilForm}>
            <p>Review the details below and click the <b>Upload</b> button, or click <b>Clear</b> to select different media.</p>
            <Box>
                <div className={classes.properties}>
                    <Text className={classes.property}>File name</Text>
                    <Text className={classes.value}>{file.name}</Text>
                </div>
                <div className={classes.properties}>
                    <Text className={classes.property}>Content type</Text>
                    <Text className={classes.value}>{file.type}</Text>
                </div>
                <div className={classes.properties}>
                    <Text className={classes.property}>File size</Text>
                    <Text className={classes.value}>{Math.floor(file.size / 1000)} kb</Text>
                </div>

                <div className={classes.actions}>
                    <Button color="blue" fullWidth mt="md" radius="md" onClick={handleUpload}>
                        Upload media
                    </Button>
                    <Button color="transparent" fullWidth mt="md" radius="md" onClick={handleClear}>
                        Clear media
                    </Button>
                </div>
            </Box>
        </div>
    )
}