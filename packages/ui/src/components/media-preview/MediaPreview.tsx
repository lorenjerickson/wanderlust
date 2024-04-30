import { Card } from "antd";
import { useMediaPreview } from "./useMediaPreview";
import { MediaAsset } from "./types";
const { Meta } = Card;


export function MediaPreview({ asset }: { asset: MediaAsset<any> }) {
    const preview = useMediaPreview({ asset });

    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={preview}
        >
            <Meta title={asset.filename} description={asset.type} />
        </Card>
    );
}
