import './App.css';
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UpcomingMeetingScreen from './screens/UpcomingMeeting/UpcomingMeetingScreen';
import OngoingMeetingAdminScreen from './screens/OngoingMeetingAdmin.js/OngoingMeetingAdminScreen';
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

  return (
    <Router>
      <Switch>
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
