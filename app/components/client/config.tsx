import { alp, defaultSettings, ToDayStr } from "@/app/lib/functions";

import Link from "next/link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { weekList } from "@/app/lib/types";
export function Config({
	config,
	settings,
	states,
	setStates,
}: {
	config?: any;
	settings: typeof defaultSettings;
	states: { [key: string]: any };
	setStates: { [key: string]: (value: any) => void };
}) {
	if (!config) return <></>;

	const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"];
	function Day() {
		const onClick = () => {
			const day = window.prompt("Set Day:");
			if (!day) return;

			if (!dayName.includes(day)) return;
			setStates.setTrackLabels({
				title: `Day Override`,
				subtitle: day,
				timeRemaining: "",
			});
			setStates.setLoading(true);
			setStates.setDay(day as keyof weekList);
		};
		return (
			<>
				<span>{states.day}</span>
				<button
					onClick={onClick}
					className="underline">
					(Change)
				</button>
			</>
		);
	}
	function Week() {
		const onClick = () => {
			const weekState = window.prompt("Set Week (odd | even):");
			if (!weekState) return;
			if (!["odd", "even"].includes(weekState)) return;
			setStates.setLoading(true);
			setStates.setweekState(weekState as "odd" | "even");
		};
		return (
			<>
				<span>
					{config.weekNumber} ({states.weekState}){" "}
				</span>
				<button
					onClick={onClick}
					className="underline">
					(Change)
				</button>
			</>
		);
	}

	const wlurl = `/classes/${settings.class.level}/${settings.class.class}/${states.weekState}.json`;
	const curDay = config.countToDate.getDay();
	var pth: { [key: string]: string | number | React.JSX.Element } = {
		Week: <Week />,
		"Stated Day": <Day />,
		"Actual Day": `${ToDayStr(curDay).long} (i: ${curDay})`,
		"Class Level": settings.class.level,
		"Class Alphabat": `${alp[settings.class.class]} (${settings.class.class})`,
		"Date From": `${config.countFromDate.toDateString()} (Semester Start)`,
		"Date To": `${config.countToDate.toDateString()} (Current Date)`,
		"Week List File": <Link href={wlurl}>@/public{wlurl}</Link>,
	};

	return (
		<div className="w-full flex justify-center">
			<Accordion className="w-96 bg-secondary-color text-white">
				<AccordionSummary>
					<span>Developer Tools (For sigmas only)</span>
				</AccordionSummary>
				<AccordionDetails>
					{Object.keys(pth).map((pthKey: string) => (
						<div key={pthKey}>
							{pthKey}: <span className="text-orange-600">{pth[pthKey]}</span>
						</div>
					))}
				</AccordionDetails>
			</Accordion>
		</div>
	);
}
export function PublicConfig({
	settings,
	states,
	setStates,
}: {
	settings: typeof defaultSettings;
	states: { [key: string]: any };
	setStates: { [key: string]: (value: any) => void };
}) {
	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	const ConfigClass = "flex flex-wrap items-center justify-center w-auto";
	const button =
		"flex border-grey justify-between items-center flex-wrap p-2 mx-1 my-2  rounded-xl border ";
	const buttonActive = "outline outline-1";

	function Button({
		isActive,
		children,
		setState,
	}: {
		isActive: boolean;
		children: React.ReactNode;
		setState: [(value: any) => void, any];
	}) {
		return (
			<button
				className={button + (isActive ? buttonActive : "")}
				onClick={() => {
					setStates.setLoading(true);
					setState[0](setState[1]);
					setStates.setTrackLabels({
						title: "",
						subtitle: "",
						timeRemaining: "",
					});
				}}>
				{children}
			</button>
		);
	}

	return (
		<Accordion className="w-full bg-secondary-color text-white">
			<AccordionSummary>
				<span className="w-full text-center">Modify Class, Week and Day</span>
			</AccordionSummary>
			<AccordionDetails>
				<table className="w-screen">
					<tr>
						<th>Class: </th>
						<th className={ConfigClass}>
							<Link
								href={"/settings"}
								className={button + buttonActive}>
								{" " + settings.class.level + alp[settings.class.class]}
							</Link>
						</th>
					</tr>

					<tr>
						<th>Week: </th>
						<th className={ConfigClass}>
							{["Odd", "Even"].map((state) => (
								<Button
									isActive={states.weekState == state.toLowerCase()}
									setState={[setStates.setweekState, state.toLowerCase()]}>
									{state}
								</Button>
							))}
						</th>
					</tr>

					<tr>
						<th>Day: </th>
						<th className={ConfigClass}>
							{days.map((dayKey: string) => (
								<Button
									isActive={states.day == dayKey}
									setState={[setStates.setDay, dayKey]}>
									{dayKey.split("")[0]}
								</Button>
							))}
						</th>
					</tr>
				</table>
			</AccordionDetails>
		</Accordion>
	);
}
