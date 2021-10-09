import './App.css';
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import UpcomingMeetingScreen from './screens/UpcomingMeeting/UpcomingMeetingScreen';
import OngoingMeetingAdminScreen from './screens/OngoingMeetingAdmin.js/OngoingMeetingAdminScreen';
import DashboardScreen from "./screens/Dashboard/DashboardScreen"
import EmailConfirmationScreen from "./screens/Login/EmailConfirmationScreen";
import LoginScreen from "./screens/Login/LoginScreen";
import RegistrationScreen from "./screens/Login/RegistrationScreen";
import ForgotPasswordScreen from "./screens/Login/ForgotPasswordScreen"
import ResetPasswordScreen from "./screens/Login/ResetPasswordScreen";
import { login } from './services/auth';
import { UserContext } from './context/UserContext';

export default function App() {
  const user = useContext(UserContext);
  useEffect(() => {
		if (!user) {
			login('admin@email.com', 'admin');
		}
  }, []);

	useEffect(() => {
		console.log(user)
	}, [user])

  // const login = (email, password) => {
  // 	return fetch(`${apiUrl}/auth/login`, {
  // 		headers: {
  // 			Accept: "application/json",
  // 			"Content-Type": "application/json",
  // 		},
  // 		method: "POST",
  // 		body: JSON.stringify({
  // 			email,
  // 			password,
  // 		}),
  // 	}).then(async (res) => {
  // 		if (res.status === 201) {
  // 			const data = await res.json();
  // 			setAccessToken(data.access_token || null);
  // 			if (data.expires_in)
  // 				setTimeout(refresh, data.expires_in * 1000);
  // 			localStorage.setItem("ref", data.refresh_token);
  // 			return;
  // 		}
  // 		throw res.err;
  // 	});
  // };

  // const refresh = () => {
  // 	const refToken = localStorage.getItem("ref");
  // 	console.log(refToken);

  // 	const params = new URLSearchParams({
  // 		refresh_token: refToken,
  // 		grant_type: "refresh_token",
  // 	});
  // 	return fetch(`${apiUrl}/auth/refresh?${params.toString()}`, {
  // 		headers: {
  // 			Accept: "application/json",
  // 			"Content-Type": "application/json",
  // 		},
  // 		method: "POST",
  // 	}).then(async (res) => {
  // 		if (res.status === 201) {
  // 			const data = await res.json();
  // 			setAccessToken(data.access_token || null);
  // 			if (data.expires_in)
  // 				setTimeout(refresh, data.expires_in * 1000);
  // 			localStorage.setItem("ref", data.refresh_token);
  // 			return;
  // 		}
  // 		throw res.err;
  // 	});
  // };

  function LandingPage() {
    if (user) return (<Redirect to="/home" />);
    else return (<Redirect to="/login" />);
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
				<Route path="/home">
					<DashboardScreen />
				</Route>
				<Route path="/meeting/:id">
					<UpcomingMeetingScreen />
				</Route>
				<Route path="/ongoing/:id">
					<OngoingMeetingAdminScreen />
				</Route>
			</Switch>
		</Router>
	);
}
