import React, { useState, useEffect } from "react";
import {
  Container, Paper, Typography, Box, Button, Grid, TextField,
  CssBaseline, Avatar, Link, FormGroup, FormControlLabel, Checkbox
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LockOutlined } from "@material-ui/icons"
import { useHistory } from "react-router";
import { browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

import { auth as firebaseAuth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth";

import logo from "../assets/logo.png";
import backgroundImage from "../assets/sutd_reg.png"


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    height: "5rem",
    marginRight: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },

}));


const Login: React.FC = ({ }) => {
  const classes = useStyles();

  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setUsername(e.currentTarget.value);
  }

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.currentTarget.value);
  }

  const handleRememberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRemember(e.currentTarget.checked);
  }

  const login: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, username, password);

      if (remember) {
        firebaseAuth.setPersistence(browserLocalPersistence);
      }
      else {
        firebaseAuth.setPersistence(browserSessionPersistence);
      }

      history.push("/dashboard");
    }
    catch (err) {
      alert(`${err.code} ${err.message}`)
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <FormGroup className={classes.paper}>
          <Box display="flex" flexDirection="row" alignItems="center" my={6}>
            <img className={classes.logo} src={logo} />
            <Typography className={classes.title}>
              SUTD Course Visualization
            </Typography>
          </Box>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleUsernameChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
          />
          {/* <Box alignSelf="stretch" flexDirection="row">
            <FormControlLabel control={<Checkbox onChange={handleRememberChange} />} label="Remember Me" />
          </Box> */}

          <Button
            type="submit"
            variant="outlined"
            color="secondary"
            className={classes.submit}
            onClick={login}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="/" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
          </Grid>
          <Box mt={5}>
          </Box>
        </FormGroup>
      </Grid>
    </Grid>
  )
}

export default Login
