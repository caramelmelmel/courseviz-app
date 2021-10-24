import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import { Container, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import Breadcrumbs from '../components/Breadcrumbs';
import services from "../services";

type RowView = {
    id: number,
    pillar_label: string,
    course_label: string,
    outcome_label: string,
    name: string
}

const columns: GridColDef[] = [
    { field: "pillar_label", headerName: "Pillar", width: 140, editable: false },
    { field: "course_label", headerName: "Course", width: 140, editable: false },
    { field: "outcome_label", headerName: "ID", width: 100, editable: false },
    { field: "name", headerName: "Name", width: 600, editable: false },
];

const CreateMO: React.FC = ({ }) => {
    const { pillar_id, course_id } = useParams<{ pillar_id: string | undefined, course_id: string | undefined }>();
    const pid = Number(pillar_id);
    const cid = Number(course_id)
    const history = useHistory();


    const [form, setForm] = useState({
        id: "",
        name: "",
    });

    const [defaultFormValues, setDefaultFormValues] = useState({
        id: "",
        name: "",
    })


    const onChangeHandler = (label: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = { ...form };
            f[label] = e.currentTarget.value;
            setForm(f);
        }
    }

    const submitForm = async () => {
        const emptyFields: string[] = [];
        Object.entries(form).forEach(([k, v]) => {
            if (v == "") {
                emptyFields.push(k);
            }
        });

        if (emptyFields.length != 0) {
            alert(`ERROR: The following fields cannot be empty:\n${emptyFields.reduce((p, c) => (p + "\n" + c))}`);
            return;
        }

        if (cid == null) {
            return;
        }

        const [_, error] = await services.outcomes.create(form, cid, pid);

        if (error != null) {
            alert(`ERROR: ${error.message}`);
            return;
        }

        history.push(`/dashboard/pillars/${pid}/courses/${cid}`);
        return;
    }

    const cancelHandler = () => {
        history.push(`/dashboard/pillars/${pid}/courses/${cid}`);
    }

    return (
        <Container>
            <Breadcrumbs />
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box my={2} display="flex" flexDirection="row" justifyContent="space-between" alignSelf="stretch">
                    <Typography variant="h4">Create Measurable Outcome</Typography>
                </Box>
                <Box my={2} display="flex" alignSelf="stretch">
                    <Grid container spacing={3}>
                        <Grid item xs={2}>
                            <Box my={1}>
                                <Typography align="right">ID:</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                key={`default-${defaultFormValues.id}`}
                                onChange={onChangeHandler("id")}
                                defaultValue={defaultFormValues.id}
                                variant="outlined"
                                size="small"
                                fullWidth />
                        </Grid>
                        <Grid item xs={2} />

                        <Grid item xs={2}>
                            <Box my={1}>
                                <Typography align="right">Name:</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                key={`default-${defaultFormValues.name}`}
                                onChange={onChangeHandler("name")}
                                defaultValue={defaultFormValues.name}
                                variant="outlined"
                                size="small"
                                fullWidth />
                        </Grid>
                        <Grid item xs={2} />

                    </Grid>
                </Box>

                <Box my={4}>
                    <Button variant="contained" color="primary" onClick={submitForm} >Create Outcome</Button>
                    <Button variant="outlined" style={{ marginLeft: "0.5rem", color: "#dc3545" }} onClick={cancelHandler} >Cancel</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default CreateMO;
