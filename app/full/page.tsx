import TableForWeek from "../components/tableForWeek/component";
import "./style.css";

export default function Full() {
	return (
		<>
			<div id="full-root">
				<TableForWeek oddeven="odd"></TableForWeek>
				<TableForWeek oddeven="even"></TableForWeek>
			</div>
		</>
	);
}
