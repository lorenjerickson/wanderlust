
import { Button, Typography } from 'antd';

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
            <div>
                <div className={classes.properties}>
                    <Typography className={classes.property}>File name</Typography>
                    <Typography className={classes.value}>{file.name}</Typography>
                </div>
                <div className={classes.properties}>
                    <Typography className={classes.property}>Content type</Typography>
                    <Typography className={classes.value}>{file.type}</Typography>
                </div>
                <div className={classes.properties}>
                    <Typography className={classes.property}>File size</Typography>
                    <Typography className={classes.value}>{Math.floor(file.size / 1000)} kb</Typography>
                </div>

                <div className={classes.actions}>
                    <Button color="blue" onClick={handleUpload}>
                        Upload media
                    </Button>
                    <Button color="transparent" onClick={handleClear}>
                        Clear media
                    </Button>
                </div>
            </div>
        </div>
    )
}