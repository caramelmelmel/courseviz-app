import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Container, Box, Typography, Button, Link } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Breadcrumbs from '../components/Breadcrumbs';
import services from "../services";

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 120, editable: false },
    { field: "description", headerName: "Description", width: 480, editable: false },
    {
        field: "website",
        headerName: "Website",
        width: 360,
        editable: false,
        renderCell: (params: GridRenderCellParams) => {
            const url = String(params.value);
            return (<Link href={url}>{url}</Link>)
        }
    },
    {
        field: "options",
        headerName: "Options",
        width: 180,
        editable: false,
        renderCell: (params: GridRenderCellParams) => {
            const id = String(params.row.id);
            return (
                <Box display="flex" flexDirection="row" >
                    <RouterLink to={`/dashboard/pillars/${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary">View</Button>
                    </RouterLink>

                    <RouterLink to={`/dashboard/pillars/${id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary">Edit</Button>
                    </RouterLink>
                </Box>
            )
        }
    },
];

const ViewPillars: React.FC = ({ }) => {
    const [rows, setRows] = useState<Pillar[]>([]);

    useEffect(() => {
        (async () => {
            const [pillars, err] = await services.pillars.readAll();
            if (err != null) {
                return;
            }

            if (pillars != null) {
                setRows(pillars);
            }
        })()
    }, [])

    return (
        <Container>
            <Breadcrumbs />
            <Box>
                <Box my={2} display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="h4">Pillars</Typography>
                    <RouterLink to="/dashboard/pillars/create" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary" startIcon={<Add />}>Create Pillar</Button>
                    </RouterLink>
                </Box>

                <div style={{ height: "500px" }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                    />
                </div>
            </Box>
        </Container>
    )
};

export default ViewPillars