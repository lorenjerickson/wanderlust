import { Button, ButtonGroup, Grid, GridCol, Table, Modal } from '@mantine/core';
import { IconGrid3x3, IconGrid4x4, IconList, IconListDetails, IconMusic, IconPhoto, IconSquare, IconVideo } from '@tabler/icons-react';
import { NavBar } from '@wanderlust/ui';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './MediaList.module.scss';
import { useDisclosure } from '@mantine/hooks';
import MediaUpload from '../../components/upload/MediaUpload';
import { useMedia } from '../../hooks/useMedia';

export default function MediaManager() {
    const [mode, setMode] = useState("list");
    const { getAll } = useMedia();
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        getAll().then((res) => {
            setData(res);
        });
    }, [getAll]);

    const gridCols = () => {
        switch (mode) {
            case "4x4":
                return 4;
            case "3x3":
                return 3;
            case "1x1":
                return 1;
            default:
                return 0;
        }
    };

    const getThumbnail = (item: any) => {
        switch (item.type) {
            case "image":
                return <img src={item.url} alt={item.name} />;
            case "audio":
                return <IconMusic />;
            case "video":
                return <IconVideo />;
            default:
                return "";
        }
    }

    return (
        <div className={classes.mediaManager}>
            <NavBar />

            <Modal size="xl" opened={opened} onClose={close} title="Add media">
                <MediaUpload />
            </Modal>

            <div className={classes.media}>
                <div className={classes.toolbar}>
                    <div>Media Manager</div>
                    <input type="text" placeholder="Search" />
                    <div className={classes.buttonGroup}>
                        <label htmlFor="filter">Filter:</label>
                        <ButtonGroup>
                            <Button variant="transparent" name="filter" value="all" onClick={() => setMode('list')}><IconListDetails /></Button>
                            <Button variant="transparent" name="filter" value="audio" onClick={() => setMode('list')}><IconMusic /></Button>
                            <Button variant="transparent" name="filter" value="image" onClick={() => setMode('list')}><IconPhoto /></Button>
                            <Button variant="transparent" name="filter" value="video" onClick={() => setMode('list')}><IconVideo /></Button>
                        </ButtonGroup>
                    </div>
                    <div className={classes.buttonGroup}>
                        <label htmlFor="mode">Layout:</label>
                        <Button.Group>
                            <Button variant="transparent" name="mode" value="list" onClick={() => setMode('list')}><IconList /></Button>
                            <Button variant="transparent" name='mode' value="4x4" onClick={() => setMode('4x4')}><IconGrid4x4 /></Button>
                            <Button variant="transparent" name='mode' value="3x3" onClick={() => setMode('3x3')}><IconGrid3x3 /></Button>
                            <Button variant="transparent" name='mode' value="1x1" onClick={() => setMode('1x1')}><IconSquare /></Button>
                        </Button.Group>
                    </div>
                    <Button variant='filled' onClick={() => open()}>Add media</Button>
                </div>
                {data && (
                    <div className={classes.mediaManager}>
                        {mode !== 'list' && (
                            <div className="grid">
                                <Grid columns={gridCols()}>
                                    {data.map((item: any) => (
                                        <GridCol key={item.name}>
                                            <div className="item">
                                                {getThumbnail(item)}
                                                {item.name}
                                            </div>
                                        </GridCol>
                                    ))}

                                </Grid>
                            </div>
                        )}
                        {mode === 'list' && (
                            <div className="list">
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Type</Table.Th>
                                            <Table.Th>Tags</Table.Th>
                                            <Table.Th>Last Updated</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {data.map((item: any) => (
                                            <Table.Tr key={item.name}>
                                                <Table.Td>{item.name}</Table.Td>
                                                <Table.Td>{item.type}</Table.Td>
                                                <Table.Td>{item.tags.join(', ')}</Table.Td>
                                                <Table.Td>{item.lastUpdated}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    )
}
