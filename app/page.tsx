import Client from "./components/client/client";
import Root from "./components/root";
export const dynamic = "force-dynamic"; // defaults to auto
export default async function Home() {
	const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
	const semstartDate = new Date("2025-3-21"); //? Note: Date shall be set every Saturday of the semester (2 Days before Mon)
	const currentDate = new Date();

	const _timeDifference = currentDate.getTime() - semstartDate.getTime();
	const weekNumber = Math.ceil(_timeDifference / millisecondsPerWeek);

	const HBLWeeks = [2, 6, 8, 10];
	const isOdd = !HBLWeeks.includes(weekNumber);

	return (
		<Root className="flex items-center flex-wrap justify-center flex-col">
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
