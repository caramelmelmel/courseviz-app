import React from 'react'
import { BrowserRouter as Router, Route} from "react-router-dom";


import './App.css';
import SignInSide from './components/Login';
import Register from "./components/Register";

function App() {
  return (
    <Router>
    <Route exact path='/login' component={SignInSide}/>
    <Route exact path='/register' component={Register}/>  
    </Router>
  );
}

export default App;
