import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, auth as firebaseAuth } from './firebase'

import './App.css';
import Login from './pages/Login'

import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';

import ViewCourse from './pages/ViewCourse';
import ViewPillar from './pages/ViewPillar';
import ViewPillars from './pages/ViewPillars';

import CreateCourse from './pages/CreateCourse';
import CreatePillar from './pages/CreatePillar';
import CreateMO from './pages/CreateMO';
import BatchCreateMO from './pages/BatchCreateMO';
import BatchCreateCourse from './pages/BatchCreateCourse';

import EditPillar from './pages/EditPillar';
import EditCourse from './pages/EditCourse';
import EditMO from './pages/EditMO';


const AuthRoute: React.FC<{ exact?: boolean, path: string, redirect: string }> = ({ exact, path, redirect, children }) => {
  const [user, ,] = useAuthState(auth);
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_FIREBASE_MODE == "layout") {
      setLoading(false);
      return;
    }

    if (!user) {
      history.push(redirect);
      return;
    }

    setLoading(false);
  }, [user])

  return (
    <Route exact={!!exact} path={path}>
      {loading ? null : children}
    </Route>
  )
}



const App: React.FC = ({ }) => {
  return (
    <Router>
      <Switch>
        {/* Unauthenticated routes */}
        <Route exact path="/login">
          <Login />
        </Route>

        {/* Authenticated routes */}
        <AuthRoute path="/dashboard" redirect="/login">
          <NavBar />
          <Switch>
            <Route exact path="/dashboard">
              <Redirect to="/dashboard/pillars" />
            </Route>

            {/* The overall visualization */}
            <Route exact path="/dashboard/visualization">
              <Dashboard />
            </Route>

            {/* Pillars */}
            <Route exact path="/dashboard/pillars">
              <ViewPillars />
            </Route>
            <Route exact path="/dashboard/pillars/create">
              <CreatePillar />
            </Route>
            <Route exact path="/dashboard/pillars/:pillar_id">
              <ViewPillar />
            </Route>
            <Route exact path="/dashboard/pillars/:pillar_id/edit">
              <EditPillar />
            </Route>

            {/* Courses */}
            <Route exact path="/dashboard/pillars/:pillar_id/batch_create_course">
              <BatchCreateCourse />
            </Route>
            <Route exact path="/dashboard/pillars/:pillar_id/courses/create">
              <CreateCourse />
            </Route>
            <Route exact path="/dashboard/pillars/:pillar_id/courses/:course_id">
              <ViewCourse />
            </Route>
            <Route exact path="/dashboard/pillars/:pillar_id/courses/:course_id/edit">
              <EditCourse />
            </Route>

            {/* Measurable Outomes */}
            <Route exact path="/dashboard/pillars/:pillar_id/batch_create_outcome">
              <BatchCreateMO />
            </Route>
            <Route exact path="/dashboard/pillars/:pillar_id/courses/:course_id/outcomes/create">
              <CreateMO />
            </Route>
            <Route exact path="/dashboard/pillars/:pillar_id/courses/:course_id/outcomes/:outcome_id/edit">
              <EditMO />
            </Route>
          </Switch>
        </AuthRoute>

        <Route>
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
