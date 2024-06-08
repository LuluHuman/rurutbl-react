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

	const oddeven = weekNumber % 2 == 0 && weekNumber > 0 ? "even" : "odd";
	const OddEven = weekNumber % 2 == 0 && weekNumber > 0 ? "Even" : "Odd"; //ill fix this later
	const canteenCrowdness = {
		Recess: JSONStringifyParse(await import(`../public/api/getCommonRecess${OddEven}.json`)),
		Break: JSONStringifyParse(await import(`../public/api/getCommonBreak${OddEven}.json`)),
	};

	function JSONStringifyParse(json: object) {
		return JSON.parse(JSON.stringify(json));
	}

	return (
		<>
			<Client
				canteenCrowdness={canteenCrowdness}
				oddeven={oddeven}
			/>
		</>
	);
}
