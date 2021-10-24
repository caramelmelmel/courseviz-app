import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import Breadcrumbs from '../components/Breadcrumbs';
import services from "../services";

const CreateCourse: React.FC = ({ }) => {
    const { pillar_id } = useParams<{ pillar_id: string | undefined }>();
    const pid = Number(pillar_id);
    const history = useHistory();

    const [_, setPillar] = useState<PillarView>({
        name: "",
        description: "",
        website: "",
    });

    const [form, setForm] = useState({
        id: "",
        name: "",
        description: "",
    });

    useEffect(() => {
        (async () => {
            const [pillar, perr] = await services.pillars.read(pid);
            if (perr != null || pillar == null) {
                alert(`ERROR: ${perr.message}`);
            }

            setPillar(pillar);
        })()
    }, [])

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
            alert(`ERROR: The following fields cannot be empty:\n${emptyFields.reduce((p, c) => (p + "\n" + c))}`)
            return;
        }

        const [_, error] = await services.courses.create(form, pid);

        if (error != null) {
            alert(`ERROR: ${error.message}`);
            return;
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
                    <Typography variant="h4">Create New Course</Typography>
                </Box>
                <Box my={2}>
                    <Grid container spacing={3}>

                        <Grid item xs={2}>
                            <Box my={1}>
                                <Typography align="right">ID:</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                onChange={onChangeHandler("id")}
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
                                onChange={onChangeHandler("name")}
                                variant="outlined"
                                size="small"
                                fullWidth />
                        </Grid>
                        <Grid item xs={2} />

                        <Grid item xs={2}>
                            <Box my={1}>
                                <Typography align="right">Description:</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                onChange={onChangeHandler("description")}
                                variant="outlined"
                                size="small"
                                fullWidth />
                        </Grid>
                        <Grid item xs={2} />

                    </Grid>
                </Box>
                <Box my={2}>
                    <Button variant="contained" color="primary" onClick={submitForm} >Create Course</Button>
                    <Button variant="outlined" style={{ marginLeft: "0.5rem", color: "#dc3545" }} onClick={cancelHandler} >Cancel</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default CreateCourse
