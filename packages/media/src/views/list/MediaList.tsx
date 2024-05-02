import { MediaPreview, ToggleButtonGroup } from '@wanderlust/ui';
import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedia } from '../../hooks/useMedia';
import classes from './MediaList.module.scss';
import { IconGrid3x3, IconGrid4x4, IconLayout2, IconLayoutGrid, IconLayoutList, IconList, IconMusic, IconPhoto, IconTable, IconVideo } from '@tabler/icons-react';

const mediaTypes = [{ icon: <IconLayout2 />, value: 'All' }, { icon: <IconPhoto />, value: 'Images' }, { icon: <IconMusic />, value: 'Audio' }, { icon: <IconVideo />, value: 'Video' }];
const layouts = [{ icon: <IconList />, value: 'List' }, { icon: <IconGrid4x4 />, value: '4x4' }, { icon: <IconGrid3x3 />, value: '3x3' }, { icon: <IconLayoutGrid />, value: '2x2' }];

export default function MediaManager() {
    const [layout, setLayout] = useState("list");
    const [filter, setFilter] = useState("all");
    const { getAll } = useMedia();
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        getAll().then((res) => {
            setData(res);
        });
    }, [getAll]);

    const gridCols = () => {
        switch (layout) {
            case "4x4":
                return 'col4';
            case "3x3":
                return 'col3';
            case "2x2":
                return 'col2';
            default:
                return 'col1';
        }
    };

    const tableCols = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
        },
    ];

    const tableData = data.map((item) => ({
        key: item.id,
        name: item.filename,
        type: item.type,
        size: item.size,
        actions: <Button onClick={() => navigate(`../edit/${item.id}`)}>Edit</Button>,
    }));

    const handleFilterChnage = (value: string) => setFilter(value);
    const handleLayoutChange = (value: string) => setLayout(value);

    return (
        <div className={classes.mediaManager}>
            <div className={classes.media}>
                <div className={classes.toolbar}>
                    <div>Media Manager</div>
                    <input type="text" placeholder="Search" />
                    <div className={classes.buttonGroup}>
                        <label htmlFor="filter">Filter:</label>
                        <ToggleButtonGroup buttons={mediaTypes} onChange={handleFilterChnage} />
                    </div>
                    <div className={classes.buttonGroup}>
                        <label htmlFor="layout">Layout:</label>
                        <ToggleButtonGroup buttons={layouts} onChange={handleLayoutChange} />
                    </div>
                </div>
                {data && (
                    <div className={classes.mediaManager}>
                        {layout !== 'list' && (
                            <div className={`${classes.grid} ${gridCols()}`}>
                                {data.map((item: any) => (
                                    <MediaPreview asset={item} key={item.name} />
                                ))}
                            </div>
                        )}
                        {layout === 'list' && (
                            <div className="list">
                                <Table columns={tableCols} dataSource={tableData} />

                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    )
}
