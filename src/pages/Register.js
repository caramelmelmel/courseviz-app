import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
// import { auth } from '../firebase/firebase.utils';
//designing stuff
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
//dropdown
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
//status handling
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        SUTD Courseviz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl:{
    margin: theme.spacing(1),
    minWidth: 120,
  }, 
  SnackDisplay:{
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  }, 

}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function SignUp() {
  const classes = useStyles();

  //handle change
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [role,setRole] = useState('');

  //error handling 
  const [error, setError] = useState('');
  const [signUpErr, setSignUpErr] = useState(null);

  //snackbar status 
  const [open, setOpen] = useState(false);

  const handleClick = () => {
      setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleSubmit = (e) => {
      e.preventDefault();
      //check 
      if(!email || !role || !password){
          setError('Please fill in all fields');
          setSignUpErr(true)
      }
      else if(!email.match(/^\w{0,}@mymail.sutd\.edu\.sg$/)){
          setError('Please use an SUTD registered email')
          setSignUpErr(true)
      }
      else if(password.length < 8){
          setError('Please make your password longer than 8 Characters')
          setSignUpErr(true)
      }
      else if (!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)){
          setError('Password must have special character, capital letter, small letter and number')
          setSignUpErr(true)
      }
      else{
      auth.createUserWithEmailAndPassword(email, password).then((userCredential) =>{
          var user = userCredential.user;
          console.log(user);
          console.log(role);
          console.log(user.emailVerified)
          //send email
          user.sendEmailVerification().then(
              alert('please check your email')
          )
      }
      ).catch((error)=>{
          alert(error);
      })
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete= "true"
                name="id"
                variant="outlined"
                required
                fullWidth
                label="Full Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={role}
          onChange={e=>setRole(e.target.value)}
          label="Role"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"admin"}>Admin</MenuItem>
          <MenuItem value={"faculty"}>Faculty</MenuItem>
          
        </Select>
      </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={e=>setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e=>setPassword(e.target.value)}
              />
            </Grid>
            
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="secondary"
            className={classes.submit}
            onClick={handleClick}
            alignRight
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
      { signUpErr ?<div className={classes.SnackDisplay}>
          <Snackbar
            open={open}
            onClose={handleClose}
            autoHideDuration={6000}>
                <Alert severity= "error"> 
                {error}
                </Alert>
                </Snackbar>
          
      </div> : <div className={classes.SnackDisplay}>
          <Snackbar
          open={open}
          onClose={handleClose}
          autoHideDuration={6000}
          >
              <Alert severity="success">
                  Registered successfully 
              </Alert>
          </Snackbar>
      </div>

      }
    </Container>
  );
}
