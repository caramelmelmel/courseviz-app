import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Container, Typography, Box, Button, Link } from "@material-ui/core";
import { Add } from "@material-ui/icons"
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import services from "../services";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100, editable: false },
    { field: "name", headerName: "Name", width: 600, editable: false },
    {
        field: "options",
        headerName: "Options",
        width: 240,
        editable: false,
        renderCell: (params: GridRenderCellParams) => {
            const pid = String(params.row.pillar_id);
            const cid = String(params.row.id_int);
            const oid = String(params.row.id_int);
            return (
                <Box display="flex" flexDirection="row" >
                    <RouterLink to={`/pillars/${pid}/courses/${cid}/outcomes/${oid}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary">Edit</Button>
                    </RouterLink>
                </Box>
            )
        }
    },
];

const ViewCourse: React.FC = ({ }) => {
    const { pillar_id, course_id } = useParams<{ pillar_id: string | undefined, course_id: string | undefined }>();
    const pid = Number(pillar_id);
    const cid = Number(course_id);

    const [course, setCourse] = useState<CourseView>({
        id: "",
        name: "",
        description: "",
    });

    const [outcomes, setOutcomes] = useState<MO[]>([]);

    useEffect(() => {
        (async () => {
            const [course, perr] = await services.courses.read(cid);
            if (perr == null && course != null) {
                setCourse(course);
            }

            const [outcomes, cerr] = await services.outcomes.readAll(cid);
            if (cerr == null && outcomes != null) {
                setOutcomes(outcomes);
            }
        })()
    }, [])

    return (
        <Container>
            <Box my={2}>
                <Typography variant="h4">Course</Typography>
                <Typography variant="h5">{course.id} - {course.name}</Typography>
                <Typography>{course.description}</Typography>
            </Box>

            <Box my={2}>
                <Box my={2} display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="h4">Measurable Outcomes</Typography>
                    <RouterLink to={`/pillars/${pid}/courses/${cid}/outcomes/create`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary" startIcon={<Add />}>Create MO</Button>
                    </RouterLink>
                </Box>
                <div style={{ height: "500px" }}>
                    <DataGrid
                        columns={columns}
                        rows={outcomes}
                    />
                </div>
            </Box>
        </Container>
    )
}

export default ViewCourse;
