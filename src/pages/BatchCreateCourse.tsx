import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Container, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { DropzoneArea } from 'material-ui-dropzone';
import Papa from 'papaparse';
import Breadcrumbs from '../components/Breadcrumbs';
import services from "../services";

const useStyles = makeStyles(theme => createStyles({
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
}));

type CsvRow = {
    id: string,
    name: string,
}

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 180, editable: false },
    { field: "name", headerName: "Name", width: 600, editable: false },
];

const BatchCreateMO: React.FC = ({ }) => {
    const history = useHistory();
    const classes = useStyles();

    const { pillar_id, } = useParams<{ pillar_id: string | undefined }>();
    const pid = Number(pillar_id);

    const [courses, setCourses] = useState<CourseView[]>([]);


    const fileChangeHandler = async (loadedFiles: File[]) => {
        if (loadedFiles.length == 0) {
            setCourses([]);
            return;
        }

        const file = loadedFiles[0];
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const rows = results.data.map(c => ({ ...c, description: ""}));
                setCourses(rows);
            }
        })
    }

    const submitForm = async () => {
        for (const course of courses) {
            const [_, error] = await services.courses.create(course, pid);

            if (error != null) {
                alert(`ERROR: ${error.message}`);
                return;
            }
        }

        history.push(`/dashboard/pillars/${pid}`);
        return;
    }

    const cancelHandler = () => {
        history.push(`/dashboard/pillars/${pid}`);
    }

    return (
        <Container>
            <Breadcrumbs />
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box my={2} display="flex" flexDirection="row" justifyContent="space-between" alignSelf="stretch">
                    <Typography variant="h4">Batch Create Course</Typography>
                </Box>
                <Box my={2} display="flex" alignSelf="stretch">
                    <Grid container spacing={3}>
                        <Grid item xs={2} />
                        <Grid item xs={8}>
                            <DropzoneArea
                                acceptedFiles={['text/csv']}
                                filesLimit={1}
                                dropzoneText={"drag and drop a .csv file or click"}
                                onChange={fileChangeHandler}
                                showPreviews={true}
                                showPreviewsInDropzone={false}
                                useChipsForPreview
                                previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                previewChipProps={{ classes: { root: classes.previewChip } }}
                                previewText="Loaded files"
                            />
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Box>

                <Box my={2} display="flex" alignSelf="stretch" style={{ height: "500px" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={2} />
                        <Grid item xs={8}>
                            <Box my={1}>
                                <Typography align="left">Loaded Course:</Typography>
                            </Box>
                            <DataGrid
                                columns={columns}
                                rows={courses}
                            />
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Box>

                <Box my={4}>
                    <Button variant="contained" color="primary" onClick={submitForm}>Batch Create Course</Button>
                    <Button variant="outlined" style={{ marginLeft: "0.5rem", color: "#dc3545" }} onClick={cancelHandler} >Cancel</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default BatchCreateMO;
