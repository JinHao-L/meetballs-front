import './App.css';
import React, { useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import UpcomingMeetingScreen from './screens/UpcomingMeeting/UpcomingMeetingScreen';
import OngoingMeetingAdminScreen from './screens/OngoingMeetingAdmin.js/OngoingMeetingAdminScreen';
import DashboardScreen from './screens/Dashboard/DashboardScreen';
import EmailConfirmationScreen from './screens/Login/EmailConfirmationScreen';
import LoginScreen from './screens/Login/LoginScreen';
import RegistrationScreen from './screens/Login/RegistrationScreen';
import ForgotPasswordScreen from './screens/Login/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/Login/ResetPasswordScreen';
import { UserContext } from './context/UserContext';

export default function App() {
  const user = useContext(UserContext);
  useEffect(() => {
    console.log(user);
  }, [user]);

  function LandingPage() {
    if (user) return <Redirect to="/home" />;
    else return <Redirect to="/login" />;
  }

  /**
   * @param {JSX.Element} child
   * @returns
   */
  function RouteIfLoggedIn({ path, children }) {
    return user && <Route path={path}>{children}</Route>;
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/confirm-email">
          <EmailConfirmationScreen />
        </Route>
        <Route path="/login">
          <LoginScreen />
        </Route>
        <Route path="/forgot-password">
          <ForgotPasswordScreen />
        </Route>
        <Route path="/app/password-reset">
          <ResetPasswordScreen />
        </Route>
        <Route path="/signup">
          <RegistrationScreen />
        </Route>
        <RouteIfLoggedIn path="/home">
          <DashboardScreen />
        </RouteIfLoggedIn>
        <RouteIfLoggedIn path="/meeting/:id">
          <UpcomingMeetingScreen />
        </RouteIfLoggedIn>
        <RouteIfLoggedIn path="/ongoing/:id">
          <OngoingMeetingAdminScreen />
        </RouteIfLoggedIn>
        <Route path="*">
          <Redirect to={{ pathname: '/' }} />
        </Route>
      </Switch>
    </Router>
  );
}
