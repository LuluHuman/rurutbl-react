import { ClassSelector, ElecSelector } from "./settingsSegment";
import "./style.css";

export default async function Settigs() {
	return (
		<>
			<ClassSelector
				title="Class"
			/>
			<ElecSelector
				title="Science Electives"
				props="Sci"
			/>
		</>
	);
}
