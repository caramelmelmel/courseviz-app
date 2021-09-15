import React from "react";
import { Typography, Box, Grid, TextField } from "@material-ui/core";

export type TextFormField = {
    label: string,
    defaultValue?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
}

export type TextFormFieldLabel = string;

const TextForm: React.FC<{ formFields: TextFormField[] }> = ({ formFields }) => {
    const rows = formFields.map(({ label, defaultValue, onChange }) => {
        defaultValue = !!defaultValue ? defaultValue : "";
        onChange = !!onChange ? onChange : () => { };

        return (
            <React.Fragment>
                <Grid item xs={3}>
                    <Box my={1}>
                        <Typography align="right">{label}:</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        key={`defaultValue-${defaultValue}`}
                        onChange={onChange}
                        defaultValue={defaultValue}
                        variant="outlined"
                        size="small"
                        fullWidth />
                </Grid>
                <Grid item xs={3} />
            </React.Fragment>
        );

    })

    return (
        <Grid container spacing={3}>
            {rows}
        </Grid>
    )
}

export default TextForm;
