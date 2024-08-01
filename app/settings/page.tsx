import Root from "../components/root";
import { ClassSelector, ElecSelector } from "./settingsSegment";

export default async function Settigs() {
	return (
		<Root>
			<ClassSelector title="Class" />
			<ElecSelector
				title="Science Electives"
				props="Sci"
			/>
		</Root>
	);
}
