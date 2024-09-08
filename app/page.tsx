import Client from "./components/client/client";
import Root from "./components/root";
export default async function Home() {
	const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
	const semstartDate = new Date("2024-9-7"); //? Note: Date shall be set every Saturday of the semester (2 Days before Mon)
	const currentDate = new Date();

	const _timeDifference = currentDate.getTime() - semstartDate.getTime();
	const weekNumber = Math.ceil(_timeDifference / millisecondsPerWeek);
	const isOdd = weekNumber % 2 !== 0;

	return (
		<Root className="flex items-center flex-wrap justify-center">
			<Client
				isOdd={isOdd}
				config={{
					weekNumber: weekNumber,
					countFromDate: semstartDate,
					countToDate: currentDate,
				}}
			/>
		</Root>
	);
}
