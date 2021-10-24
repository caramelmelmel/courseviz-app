import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Container, Typography, Box, Button, Link } from "@material-ui/core";
import { Add, PlaylistAdd } from "@material-ui/icons"
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Breadcrumbs from '../components/Breadcrumbs';
import services from "../services";

type MORow = {
    id_int: number,
    pillar_id: number,
    course_id: number,
    id: string,
    name: string,
    prereqs: MOView[]
}

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100, editable: false },
    { field: "name", headerName: "Name", width: 400, editable: false },
    {
        field: "prereqs",
        headerName: "Prerequisites",
        width: 400,
        editable: false,
        renderCell: (params: GridRenderCellParams) => {
            const prereqs = params.row.prereqs;
            const displayedPrereqs = prereqs.map((p) => (
                <Typography variant="body2">
                    {`${p?.id}: ${p?.name}`}
                </Typography>
            ))

            return (
                <div style={{ overflowY: "auto" }}>
                    {displayedPrereqs}
                </div>
            )

        }
    },
    {
        field: "options",
        headerName: "Options",
        width: 240,
        editable: false,
        renderCell: (params: GridRenderCellParams) => {
            const pid = String(params.row.pillar_id);
            const cid = String(params.row.course_id);
            const oid = String(params.row.id_int);
            return (
                <Box display="flex" flexDirection="row" >
                    <RouterLink to={`/dashboard/pillars/${pid}/courses/${cid}/outcomes/${oid}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
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

    const [outcomes, setOutcomes] = useState<MORow[]>([]);

    useEffect(() => {
        (async () => {
            const [course, perr] = await services.courses.read(cid);
            if (perr == null && course != null) {
                setCourse(course);
            }

            const [outcomes, cerr] = await services.outcomes.readAll(null);

            const [links, lerr] = await services.links.readAll(null);
            if (cerr == null && outcomes != null && lerr == null && links != null) {
                let rows = outcomes.filter((o) => o.course_id == cid);
                const moRows = rows.map((r) => {
                    const moRow = { ...r, prereqs: [] }
                    const moLinks = links.filter((l) => l.dst == r.id_int);

                    moRow.prereqs = moLinks.map((l) => {
                        const prereq = outcomes.find(o => o.id_int == l.src);

                        return prereq;
                    })
                    
                    moRow.prereqs = moRow.prereqs.filter(p => p != undefined);

                    return moRow
                })

                setOutcomes(moRows);
            }
        })()
    }, [])

    return (
        <Container>
            <Breadcrumbs />
            <Box>
                <Typography variant="h4">{course.id} - {course.name}</Typography>
                <Typography>{course.description}</Typography>
            </Box>

            <Box my={2}>
                <Box my={2} display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="h4">Measurable Outcomes</Typography>
                    <Box>
                        <RouterLink to={`/dashboard/pillars/${pid}/courses/${cid}/outcomes/create`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            <Button variant="outlined" style={{ marginRight: "0.5rem" }} color="primary" startIcon={<Add />}>Create MO</Button>
                        </RouterLink>
                    </Box>
                </Box>
                <div style={{ height: "500px" }}>
                    <DataGrid
                        rowHeight={120}
                        columns={columns}
                        rows={outcomes}
                    />
                </div>
            </Box>
        </Container>
    )
}

export default ViewCourse;
