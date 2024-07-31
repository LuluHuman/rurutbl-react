import Client from "../components/client/client";
import "./style.css";
export default async function Home() {
	// Config values / Static values
	const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
	const semstartDate = new Date("2024-6-21");

	// Date Stuff
	const currentDate = new Date();

	// Grab dem week
	const _timeDifference = currentDate.getTime() - semstartDate.getTime();
	const weekNumber = Math.ceil(_timeDifference / millisecondsPerWeek);
	const isOdd = weekNumber % 2 !== 0;

	return (
		<div className="flex items-center flex-wrap justify-center">
			<Client isOdd={isOdd}/>
		</div>
	);
}
