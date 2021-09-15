import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';

import ViewCourse from './pages/ViewCourse';
import ViewPillar from './pages/ViewPillar';
import ViewPillars from './pages/ViewPillars';

import CreateCourse from './pages/CreateCourse';
import CreatePillar from './pages/CreatePillar';
import CreateMO from './pages/CreateMO';

import EditPillar from './pages/EditPillar';
import EditCourse from './pages/EditCourse';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>

        <Route exact path="/pillars">
          <ViewPillars />
        </Route>

        <Route exact path="/pillars/create">
          <CreatePillar />
        </Route>
        <Route exact path="/pillars/:pillar_id">
          <ViewPillar />
        </Route>
        <Route exact path="/pillars/:pillar_id/edit">
          <EditPillar />
        </Route>

        <Route exact path="/pillars/:pillar_id/courses/create">
          <CreateCourse />
        </Route>
        <Route exact path="/pillars/:pillar_id/courses/:course_id">
          <ViewCourse />
        </Route>
        <Route exact path="/pillars/:pillar_id/courses/:course_id/edit">
          <EditCourse />
        </Route>
        
        <Route exact path="/pillars/:pillar_id/courses/:course_id/outcomes/create">
          <CreateMO />
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
