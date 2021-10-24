import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Container, Typography, Box, Button, Link } from "@material-ui/core";
import { Add, PlaylistAdd } from "@material-ui/icons";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Breadcrumbs from '../components/Breadcrumbs';
import services from "../services";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100, editable: false },
    { field: "name", headerName: "Name", width: 360, editable: false },
    { field: "description", headerName: "Description", width: 480, editable: false },
    {
        field: "options",
        headerName: "Options",
        width: 240,
        editable: false,
        renderCell: (params: GridRenderCellParams) => {
            const pid = String(params.row.pillar_id);
            const cid = String(params.row.id_int);
            return (
                <Box display="flex" flexDirection="row" >
                    <RouterLink to={`/dashboard/pillars/${pid}/courses/${cid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary">View</Button>
                    </RouterLink>

                    <RouterLink to={`/dashboard/pillars/${pid}/courses/${cid}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary">Edit</Button>
                    </RouterLink>
                </Box>
            )
        }
    },
];

const ViewPillar: React.FC = ({ }) => {
    const { pillar_id } = useParams<{ pillar_id: string | undefined }>();
    const pid = Number(pillar_id);

    const [pillar, setPillar] = useState<PillarView>({
        name: "",
        description: "",
        website: "",
    });

    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        (async () => {
            const [pillar, perr] = await services.pillars.read(pid);
            if (perr === null && pillar != null) {
                setPillar(pillar);
            }

            const [courses, cerr] = await services.courses.readAll(pid);
            if (cerr === null && courses != null) {
                setCourses(courses);
            }
        })()
    }, [])

    return (
        <Container>
            <Breadcrumbs />
            <Box>
                <Typography variant="h4">{pillar.name}</Typography>
                <Typography>{pillar.description}</Typography>
                <Link href={pillar.website}>{pillar.website}</Link>

            </Box>

            <Box my={2}>
                <Box my={2} display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="h4">Courses</Typography>

                    <Box>
                        <RouterLink to={`/dashboard/pillars/${pid}/courses/create`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            <Button variant="outlined" color="primary" startIcon={<Add />}>Create Course</Button>
                        </RouterLink>
                        <RouterLink to={`/dashboard/pillars/${pid}/batch_create_course`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            <Button variant="outlined" color="primary" startIcon={<PlaylistAdd />}>Batch Create Course</Button>
                        </RouterLink>

                        <RouterLink to={`/dashboard/pillars/${pid}/batch_create_outcome`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            <Button variant="outlined" color="primary" startIcon={<PlaylistAdd />}>Batch Create MO</Button>
                        </RouterLink>
                    </Box>
                </Box>
                <div style={{ height: "500px" }}>
                    <DataGrid
                        columns={columns}
                        rows={courses}
                    />
                </div>
            </Box>
        </Container>
    )
}

export default ViewPillar;
