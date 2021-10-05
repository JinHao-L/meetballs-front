import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UpcomingMeetingScreen from "./screens/UpcomingMeeting/UpcomingMeetingScreen";

export default function App() {
	return (
		<Router>
			<Switch>
				<Route path="/meeting/:id">
					<UpcomingMeetingScreen />
				</Route>
			</Switch>
		</Router>
	);
}
