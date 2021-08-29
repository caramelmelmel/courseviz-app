import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";


import './App.css';
import SignInSide from './pages/Login';
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Route exact path='/login' component={SignInSide} />
      <Route exact path='/register' component={Register} />
    </Router>
  );
}

export default App;
