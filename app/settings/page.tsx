import { ClassSelector, ElecSelector } from "../components/settingsSegment/component";
import "./style.css";

export default async function Settigs() {
	const classes = await import("@/public/api/classes.json");
	function JSONStringifyParse(json: object) {
		return JSON.parse(JSON.stringify(json));
	}
	return (
		<>
			<ClassSelector
				title="Class"
				props={JSONStringifyParse(classes)}
			/>
			<ElecSelector
				title="Science Electives"
				props="Sci"
			/>
		</>
	);
}
