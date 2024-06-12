import Client from "./components/client/client";

export default async function Home() {
	// Config values / Static values
	const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
	const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"];
	const semstartDate = new Date("2024-3-17");

	// Date Stuff
	const currentDate = new Date();

	// Grab dem week
	const _timeDifference = currentDate.getTime() - semstartDate.getTime();
	const weekNumber = Math.ceil(_timeDifference / millisecondsPerWeek);
	
	const isOdd = weekNumber % 2 !== 0;

	const canteenCrowdness = {
		Recess: JSONStringifyParse(
			await import(`../public/api/getCommonRecess${isOdd ? "Odd" : "Even"}.json`)
		),
		Break: JSONStringifyParse(
			await import(`../public/api/getCommonBreak${isOdd ? "Odd" : "Even"}.json`)
		),
	};

	function JSONStringifyParse(json: object) {
		return JSON.parse(JSON.stringify(json));
	}

	return (
		<div className="flex items-center flex-wrap justify-center">
			<Client
				canteenCrowdness={canteenCrowdness}
				isOdd={isOdd}
			/>
		</div>
	);
}
