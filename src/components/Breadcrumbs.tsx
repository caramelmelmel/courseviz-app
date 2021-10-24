import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Box, Paper, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as _ from 'lodash';
import services from "../services";

const useStyles = makeStyles((theme) => ({
    breadcrumb: {
        maxWidth: "20rem",
    }

}));

const Breadcrumbs: React.FC = ({ }) => {
    const classes = useStyles();

    const history = useHistory();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    let pathParts = history.location.pathname.split("/");
    pathParts = pathParts.filter(p => p != "" && p != "dashboard");

    useEffect(() => {
        (async () => {
            const breadcrumbs = [];

            // dashboard
            const linkParts = [];
            breadcrumbs.push(
                <RouterLink key="pillars" to="/dashboard/pillars">Pillars</RouterLink>);

            // janky parser-thing
            let previousEntity = "";
            while (true) {
                const part = pathParts.shift();
                linkParts.push(part);

                // no more parts to parse
                if (!part) { break }

                // if there is no previous entity and the part is not an action, this part is definitely an entity
                if (previousEntity == "" && 
                    part != "create" && 
                    part != "edit" && 
                    part != "batch_create_outcome" &&
                    part != "batch_create_course") {
                    previousEntity = part;
                    continue;
                }

                // else this part can either be an action or an entity id
                // if it is an action ("create" or "edit")
                if (part == "create" || part == "edit") {
                    let text = `${part} ${previousEntity}`;
                    text = _.startCase(_.toLower(text));

                    breadcrumbs.push(<Typography key={text}>{text}</Typography>)

                    previousEntity = "";
                    continue;
                }

                if (part == "batch_create_outcome") {
                    const text = "Batch Create Outcomes"
                    breadcrumbs.push(<Typography key={text}>{text}</Typography>)

                    previousEntity = "";
                    continue;
                }

                if (part == "batch_create_course") {
                    const text = "Batch Create Courses"
                    breadcrumbs.push(<Typography key={text}>{text}</Typography>)

                    previousEntity = "";
                    continue;
                }

                // if it is not an action, then it is an entity id
                const id = Number(part);
                let entityName = "";

                if (previousEntity == "pillars") {
                    const [pillar, perr] = await services.pillars.read(id);
                    if (perr == null && pillar != null) {
                        entityName = pillar.name;
                    }
                }

                if (previousEntity == "courses") {
                    const [course, cerr] = await services.courses.read(id);
                    if (cerr == null && course != null) {
                        entityName = `${course.id} - ${course.name}`;
                    }
                }

                if (previousEntity == "outcomes") {
                    const [outcome, oerr] = await services.outcomes.read(id);
                    if (oerr == null && outcome != null) {
                        entityName = `${outcome.id} - ${outcome.name}`;
                    }
                }

                const to = ["/dashboard", ...linkParts].join("/");
                breadcrumbs.push(
                    <RouterLink key={entityName} to={to}>
                        <Typography noWrap className={classes.breadcrumb}>
                            {entityName}
                        </Typography>
                    </RouterLink>
                )

                previousEntity = "";
            }

            setBreadcrumbs(breadcrumbs);
        })()
    }, [])

    return (
        <Box mt={2} mb={1} py={0}>
            <MuiBreadcrumbs separator=">">
                {breadcrumbs}
            </MuiBreadcrumbs>
        </Box>

    )
}

export default Breadcrumbs