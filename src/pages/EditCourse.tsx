import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import services from "../services";

const EditPillar: React.FC = ({ }) => {
    const { pillar_id, course_id } = useParams<{ pillar_id: string | undefined, course_id: string | undefined }>();
    const pid = Number(pillar_id);
    const cid = Number(course_id)
    const history = useHistory();


    const [form, setForm] = useState({
        id: "",
        name: "",
        description: "",
    });

    const [defaultFormValues, setDefaultFormValues] = useState({
        id: "",
        name: "",
        description: "",
    })

    useEffect(() => {
        (async () => {
            const [course, perr] = await services.courses.read(cid);
            if (perr != null || course == null) {
                alert(`ERROR: ${perr.message}`);
            }

            const c = { ...course };
            delete c.pillar_id;
            delete c.id_int;

            setForm(c);
            setDefaultFormValues(c);
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

        if (cid == null) {
            return;
        }

        const [_, error] = await services.courses.update(cid, form);

        if (error != null) {
            alert(`ERROR: ${error.message}`);
            return;
        }

        history.push(`/pillars/${pid}`);
        return;
    }

    const deleteHandler = async () => {
        if (cid == null) {
            return;
        }

        const error = await services.courses.delete(cid);

        if (error != null) {
            alert(`ERROR: ${error.message}`);
            return;
        }

        history.push(`/pillars/${pid}`);
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

                    </Grid>
                </Box>
                <Box my={2}>
                    <Button variant="contained" color="primary" onClick={submitForm} >Update Course</Button>
                    <Button variant="contained" style={{ color: "white", backgroundColor: "#dc3545" }} onClick={deleteHandler} >Delete Course</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default EditPillar
