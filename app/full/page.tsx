import Root from "../components/root";
import TableForWeek from "./tableForWeek";

export default function Full() {
	return (
		<Root className="block w-auto overflow-x-scroll">
			<TableForWeek oddeven="odd"></TableForWeek>
			<TableForWeek oddeven="even"></TableForWeek>
		</Root>
	);
}
