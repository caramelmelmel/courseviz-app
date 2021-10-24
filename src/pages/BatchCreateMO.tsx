import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Container, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import { DataGrid, GridColDef, GridSelectionModel, GridRowIdGetter } from '@mui/x-data-grid';
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
    course_id: string,
    id: string,
    name: string,
}

type Row = {
    course_id_int: number,
    course_id: string,
    course_name: string,
    id: string,
    name: string,
}

const columns: GridColDef[] = [
    { field: "course_id", headerName: "Course ID", width: 160, editable: false },
    { field: "course_name", headerName: "Course Name", width: 180, editable: false },
    { field: "id", headerName: "MO ID", width: 120, editable: false },
    { field: "name", headerName: "Name", width: 600, editable: false },
];

const getRowId: GridRowIdGetter = (row) => {
    return `${row.course_id}-${row.id}`;
}

const BatchCreateMO: React.FC = ({ }) => {
    const history = useHistory();
    const classes = useStyles();

    const { pillar_id, } = useParams<{ pillar_id: string | undefined }>();
    const pid = Number(pillar_id);

    const [outcomes, setOutcomes] = useState<Row[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        (async () => {
            const [courses, cerr] = await services.courses.readAll(pid);
            if (cerr === null && courses != null) {
                setCourses(courses);
            }
        })()
    }, [])

    const fileChangeHandler = async (loadedFiles: File[]) => {
        if (loadedFiles.length == 0) {
            setOutcomes([]);
            return;
        }

        const file = loadedFiles[0];
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const getCourseDetails = (course_id: string) => {
                    const match = courses.find((c) => c.id == course_id);
                    if (!match) {
                        return {};
                    }

                    return {
                        course_id_int: match.id_int,
                        course_id: match.id,
                        course_name: match.name,
                    }
                }


                let rows = results.data.map((cRow: CsvRow) => ({
                    ...cRow,
                    ...getCourseDetails(cRow.course_id),
                })
                )

                rows = rows.filter((row) => !!row.course_id_int)

                setOutcomes(rows);
            }
        })
    }

    const submitForm = async () => {
        outcomes.forEach(async (outcome) => {
            const [_, error] = await services.outcomes.create({ id: outcome.id, name: outcome.name }, outcome.course_id_int, pid);

            if (error != null) {
                alert(`ERROR: ${error.message}`);
                return;
            }
        })

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
                    <Typography variant="h4">Batch Create Measurable Outcome</Typography>
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
                                <Typography align="left">Loaded Measurable Outcomes:</Typography>
                            </Box>
                            <DataGrid
                                columns={columns}
                                rows={outcomes}
                                getRowId={getRowId}
                            />
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Box>

                <Box my={4}>
                    <Button variant="contained" color="primary" onClick={submitForm}>Batch Create Outcome</Button>
                    <Button variant="outlined" style={{ marginLeft: "0.5rem", color: "#dc3545" }} onClick={cancelHandler} >Cancel</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default BatchCreateMO;
