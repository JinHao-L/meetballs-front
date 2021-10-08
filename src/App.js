import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UpcomingMeetingScreen from "./screens/UpcomingMeeting/UpcomingMeetingScreen";
import OngoingMeetingAdminScreen from "./screens/OngoingMeetingAdmin.js/OngoingMeetingAdminScreen";
import { io } from "socket.io-client";
import { accessTokenKey } from "./common/CommonValues";

const apiUrl = "http://localhost:3001";
export default function App() {
	const [accessToken, setAccessToken] = useState("");
	useEffect(() => {
		login("admin@email.com", "admin");
	}, []);

	useEffect(() => {
		console.log(accessToken);
		window.sessionStorage.setItem(accessTokenKey, accessToken);
		const socket = subscribe("10c7e0a8-120b-45e0-a37f-be92170bfb8d");
		return () => {
			socket.disconnect();
		};
	}, [accessToken]);

	const login = (email, password) => {
		return fetch(`${apiUrl}/auth/login`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email,
				password,
			}),
		}).then(async (res) => {
			if (res.status === 201) {
				const data = await res.json();
				setAccessToken(data.access_token || null);
				if (data.expires_in)
					setTimeout(refresh, data.expires_in * 1000);
				localStorage.setItem("ref", data.refresh_token);
				return;
			}
			throw res.err;
		});
	};

	const refresh = () => {
		const refToken = localStorage.getItem("ref");
		console.log(refToken);

		const params = new URLSearchParams({
			refresh_token: refToken,
			grant_type: "refresh_token",
		});
		return fetch(`${apiUrl}/auth/refresh?${params.toString()}`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			method: "POST",
		}).then(async (res) => {
			if (res.status === 201) {
				const data = await res.json();
				setAccessToken(data.access_token || null);
				if (data.expires_in)
					setTimeout(refresh, data.expires_in * 1000);
				localStorage.setItem("ref", data.refresh_token);
				return;
			}
			throw res.err;
		});
	};

	const subscribe = (meetingId) => {
		const socket = io(`${apiUrl}/meeting`, {
			reconnectionDelayMax: 10000,
			auth: {
				token: accessToken,
				meetingId: "10c7e0a8-120b-45e0-a37f-be92170bfb8d",
			},
		});
		socket.on("connect", function () {
			console.log("Connected");
		});
		socket.on("meetingUpdated", function (data) {
			console.log("meetingUpdated", data);
			// data is full meeting details
		});
		socket.on("participantUpdated", function () {
			console.log("participantUpdated");
			// make call to get participant list?
		});
		socket.on("agendaUpdated", function (data) {
			console.log("agendaUpdated", data);
			// make call to get updated agenda list?
		});
		socket.on("userConnected", function (msg) {
			console.log("userConnected", msg);
		});
		socket.on("disconnect", function () {
			console.log("Disconnected");
		});
		return socket;
	};

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
