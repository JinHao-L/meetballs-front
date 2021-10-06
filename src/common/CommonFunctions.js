export function getFormattedDateTime(isoDate) {
	const date = new Date(isoDate);
	const options = {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	};
	return date.toLocaleString("en-us", options);
}

export function getFormattedDuration(duration) {
	var remainingDuration = duration;
	var result = "";
	if (remainingDuration >= 3600000) {
		const hours = Math.floor(remainingDuration / 3600000);
		remainingDuration -= hours * 3600000;
		result += hours + "h ";
	}
	const minutes = Math.floor(remainingDuration / 60000);
	remainingDuration -= minutes * 60000;
	result += minutes + "min ";
	if (remainingDuration !== 0) {
		const seconds = Math.floor(remainingDuration / 1000);
		result += seconds + "s";
	}
	return result;
}
