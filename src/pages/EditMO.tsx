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

const EditMO: React.FC = ({ }) => {
    const { pillar_id, course_id, outcome_id } = useParams<{ pillar_id: string | undefined, course_id: string | undefined, outcome_id: string | undefined }>();
    const pid = Number(pillar_id);
    const cid = Number(course_id);
    const oid = Number(outcome_id)
    const history = useHistory();


    const [form, setForm] = useState({
        id: "",
        name: "",
    });

    const [defaultFormValues, setDefaultFormValues] = useState({
        id: "",
        name: "",
    })

    const [pillars, setPillars] = useState<Pillar[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [outcomes, setOutcomes] = useState<MO[]>([]);
    const [rows, setRows] = useState<RowView[]>([]);

    const [selectionModel, setSelectionModel] = useState<string[]>([]);
    const [selectedMOIds, setSelectedMOIds] = useState<number[]>([]);

    const handleOnSelectionModelChange = (m: GridSelectionModel) => {
        const ids = m.map(i => Number(i));
        setSelectedMOIds(ids);
    }

    useEffect(() => {
        (async () => {
            const [outcome, oerr] = await services.outcomes.read(oid);
            if (oerr != null || outcome == null) {
                alert(`ERROR: ${oerr.message}`);
            }

            const o = { ...outcome };
            delete o.course_id;
            delete o.pillar_id;
            delete o.id_int;

            setForm(o);
            setDefaultFormValues(o);
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const [pillars, perr] = await services.pillars.readAll();
            if (perr === null && pillars !== null) {
                setPillars(pillars);
            }

            const [courses, cerr] = await services.courses.readAll(null);
            if (cerr === null && courses !== null) {
                setCourses(courses);
            }

            const [outcomes, oerr] = await services.outcomes.readAll(null);
            if (oerr == null && outcomes != null) {
                setOutcomes(outcomes);
            }

            const [links, lerr] = await services.links.readAll(oid);
            if (lerr == null && links != null){
                const ls = links.map((l) => String(l.src));
                setSelectionModel(ls);
            }
        })()
    }, [])

    useEffect(() => {
        const pillarIdToLabel = {};
        pillars.forEach((p) => { pillarIdToLabel[p.id] = p.name })
        const courseIdToLabel = {};
        courses.forEach((c) => { courseIdToLabel[c.id_int] = c.id });

        const rows = outcomes.map((o) => ({
            id: o.id_int,
            pillar_label: pillarIdToLabel[o.pillar_id],
            course_label: courseIdToLabel[o.course_id],
            outcome_label: o.id,
            name: o.name,
        }))

        setRows(rows);
    }, [outcomes])


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

        if (oid == null) {
            return;
        }

        // const [_, error] = await services.outcomes.update(oid, form);

        // if (error != null) {
        //     alert(`ERROR: ${error.message}`);
        //     return;
        // }

        const [ls, _] = await services.links.readAll(oid);
        for (const l of ls){
            await services.links.delete(l.src, oid);
        }

        for (const src of selectedMOIds){
            await services.links.create(src, oid);
        }

        history.push(`/dashboard/pillars/${pid}/courses/${cid}`);
        return;
    }

    const deleteHandler = async () => {
        if (oid == null) {
            return;
        }

        const error = await services.outcomes.delete(oid);

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
                    <Typography variant="h4">Edit Measurable Outcome</Typography>
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

                <Box my={2} display="flex" alignSelf="stretch" style={{ height: "500px" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={2} />
                        <Grid item xs={8}>
                            <Box my={1}>
                                <Typography align="left">Select Prerequisites:</Typography>
                            </Box>
                            <DataGrid
                                checkboxSelection={true}
                                columns={columns}
                                rows={rows}
                                selectionModel={selectionModel}
                                onSelectionModelChange={handleOnSelectionModelChange}
                            />
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Box>

                <Box my={4}>
                    <Button variant="contained" style={{ marginRight: "1rem" }} color="primary" onClick={submitForm} >Update Outcome</Button>
                    <Button variant="contained" style={{ marginRight: "1rem", color: "white", backgroundColor: "#dc3545" }} onClick={deleteHandler} >Delete Outcome</Button>
                    <Button variant="outlined" style={{ color: "#dc3545" }} onClick={cancelHandler} >Cancel</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default EditMO;
