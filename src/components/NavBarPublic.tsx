import React from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Box, ButtonBase, Toolbar, Typography, Link as MuiLink } from "@material-ui/core";
import { auth as firebaseAuth } from '../firebase';

import { Link, useHistory } from "react-router-dom";
import logo from "../assets/logo.png";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        zIndex: theme.zIndex.drawer + 1,
    },

    toolBar: {
        zIndex: "inherit",
    },

    logo: {
        height: "2rem",
        marginRight: "1rem",
    },

    title: {
        fontSize: "120%",
        fontWeight: "bold",
    },

    button: {
        height: "2rem",
        margin: "0 0.5rem",
    },

    userName: {
        marginLeft: "0.5rem",
        marginRight: "1rem",
    },

    profileImage: {
        height: "2rem",
        marginLeft: "1rem",
        marginRight: "0.5rem",
    }
}))


const NavBar: React.FC = ({ }) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <AppBar
            position="static"
            className={classes.root}
        >
            <Toolbar className={classes.toolBar}>
                <Box display="flex" flexDirection="row" justifyContent="space-between" width={1}>
                    <Link to="/visualization" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <img className={classes.logo} src={logo} />
                            <Typography className={classes.title}>
                                SUTD Course Visualization
                            </Typography>
                        </Box>
                    </Link>

                    <Box display="flex" flexDirection="row" alignItems="center">
                        <Box mx={1}>
                            <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                                <Typography>
                                    Admin Sign In
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
