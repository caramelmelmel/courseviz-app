import React, { useState } from "react";
import { Container, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import services from "../services";

const CreatePillar: React.FC = ({ }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        website: "",
    });

    const onChangeHandler = (label: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = { ...form };
            f[label] = e.currentTarget.value;
            setForm(f);
        }
    }


    const history = useHistory();

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

        const [_, error] = await services.pillars.create(form);
        
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
                    <Typography variant="h4">Create New Pillar</Typography>
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

                        <Grid item xs={2}>
                            <Box my={1}>
                                <Typography align="right">Website:</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                onChange={onChangeHandler("website")}
                                variant="outlined"
                                size="small"
                                fullWidth />
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Box>
                <Box my={2}>
                    <Button variant="contained" color="primary" onClick={submitForm} >Create Pillar</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default CreatePillar
