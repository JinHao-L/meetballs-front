import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UpcomingMeetingScreen from "./screens/UpcomingMeeting/UpcomingMeetingScreen";
import OngoingMeetingAdminScreen from "./screens/OngoingMeetingAdmin.js/OngoingMeetingAdminScreen";

export default function App() {
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
