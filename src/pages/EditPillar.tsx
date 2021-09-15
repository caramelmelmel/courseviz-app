import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import services from "../services";

const EditPillar: React.FC = ({ }) => {
    const { pillar_id } = useParams<{ pillar_id: string | undefined, course_id: string | undefined }>();
    const pid = Number(pillar_id);
    const history = useHistory();


    const [form, setForm] = useState({
        name: "",
        description: "",
        website: "",
    });

    const [defaultFormValues, setDefaultFormValues] = useState({
        name: "",
        description: "",
        website: "",
    })

    useEffect(() => {
        (async () => {
            const [pillar, perr] = await services.pillars.read(pid);
            if (perr != null || pillar == null) {
                alert(`ERROR: ${perr.message}`);
            }

            const p = { ...pillar };
            delete p.id;

            setForm(p);
            setDefaultFormValues(p);
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
            alert(`ERROR: The following fields cannot be empty:\n${emptyFields.reduce((p, c) => (p + "\n" + c))}`);
            return;
        }

        if (pid == null) {
            return;
        }

        const [_, error] = await services.pillars.update(pid, form);

        if (error != null) {
            alert(`ERROR: ${error.message}`);
            return;
        }

        history.push("/pillars");
        return;
    }

    const deleteHandler = async () => {
        if (pid == null) {
            return;
        }

        const error = await services.pillars.delete(pid);

        if (error != null) {
            alert(`ERROR: ${error.message}`);
            return;
        }

        history.push("/pillars");
        return;
    }


    return (
        <Container>
            <Box my={2} display="flex" flexDirection="column" alignItems="center">
                <Box my={2} display="flex" flexDirection="row" justifyContent="space-between" alignSelf="stretch">
                    <Typography variant="h4">Edit Pillar</Typography>
                </Box>
                <Box my={2}>
                    <Grid container spacing={3}>
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

                        <Grid item xs={2}>
                            <Box my={1}>
                                <Typography align="right">Description:</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                key={`default-${defaultFormValues.description}`}
                                onChange={onChangeHandler("description")}
                                defaultValue={defaultFormValues.description}
                                variant="outlined"
                                size="small"
                                fullWidth />
                        </Grid>
                        <Grid item xs={2} />

                        <Grid item xs={2}>
                            <Box my={1}>
                                <Typography align="right">Website:</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                key={`default-${defaultFormValues.website}`}
                                onChange={onChangeHandler("website")}
                                defaultValue={defaultFormValues.website}
                                variant="outlined"
                                size="small"
                                fullWidth />
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Box>
                <Box my={2}>
                    <Button variant="contained" color="primary" onClick={submitForm} >Update Pillar</Button>
                    <Button variant="contained" style={{ color: "white", backgroundColor: "#dc3545" }} onClick={deleteHandler} >Delete Pillar</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default EditPillar
