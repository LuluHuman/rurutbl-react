"use client";

import { alp, defaultSettings, ToDayStr } from "@/app/lib/functions";

import Link from "next/link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { weekList } from "@/app/lib/types";
import { Button, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
					{config.weekNumber} ({states.weekState}/
					{states.weekState == "odd" ? "Non-HBL Week" : "HBL Week"}){" "}
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
	const countToDate = new Date(config.countToDate);
	const countFromDate = new Date(config.countFromDate);
	const curDay = countToDate.getDay();

	var pth: { [key: string]: string | number | React.JSX.Element } = {
		Week: <Week />,
		"Stated Day": <Day />,
		"Actual Day": `${ToDayStr(curDay).long} (i: ${curDay})`,
		"Class Level": settings.class.level,
		"Class Alphabat": `${alp[settings.class.class]} (${settings.class.class})`,
		"Date From": `${countFromDate.toDateString()} (Semester Start)`,
		"Date To": `${countToDate.toDateString()} (Current Date)`,
		"Week List File": <Link href={wlurl}>@/public{wlurl}</Link>,
	};

	return (
		<div className="w-full flex justify-center">
			<Accordion className="w-96 bg-secondary-color text-white">
				<AccordionSummary>
					<span>Debug</span>
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
	const outlineButtons =
		"p-2 m-1 hover:bg-white hover:bg-opacity-15 rounded-full text-center outline outline-1";
	return (
		<div className={"w-full px-2 py-4 *:text-nowrap *:my-4"}>
			<div className="overflow-x-scroll">
				<Link
					href={"/settings"}
					className={
						"p-2 mx-2 hover:bg-white hover:bg-opacity-15 rounded-full text-center outline outline-1" +
						outlineButtons
					}>
					{settings.class.level + alp[settings.class.class]}
				</Link>
				<select
					className={"bg-transparent " + outlineButtons}
					value={states.weekState}
					onChange={(e) => {
						const val = e.target.value;

						setStates.setLoading(true);
						setStates.setweekState(val);
						setStates.setTrackLabels({
							title: "",
							subtitle: "",
							timeRemaining: "",
						});
					}}>
					{["Odd", "Even"].map((state) => (
						<option
							key={state}
							value={state.toLowerCase()}>
							{state == "Odd" ? "Non-HBL wk" : "HBL wk"}
						</option>
					))}
				</select>

				<a
					href="/full"
					className={
						"p-2 mx-2 hover:bg-white hover:bg-opacity-15 rounded-full text-center outline outline-1 " +
						outlineButtons
					}>
					Show All Weeks
				</a>

				<a
					href="/settings"
					className={
						"p-2 mx-2 hover:bg-white hover:bg-opacity-15 rounded-full text-center outline outline-1 " +
						outlineButtons
					}>
					Settings
				</a>
			</div>
			<div className="flex  w-full justify-between ">
				<IconButton
					className="hover:bg-white hover:bg-opacity-15 rounded-full p-2"
					onClick={() => {
						const index = days.findIndex((o) => o == states.day);
						const prevIndex = index - 1 < 0 ? days.length - 1 : index - 1;
						const prevDay = days[prevIndex];

						setStates.setLoading(true);
						setStates.setDay(prevDay);
						setStates.setTrackLabels({
							title: "",
							subtitle: "",
							timeRemaining: "",
						});
					}}>
					<ArrowBackIosNewIcon className="*:fill-white" />
				</IconButton>
				<div className="gap-2 flex">
					<select
						className="bg-transparent p-2 hover:bg-white hover:bg-opacity-15 rounded-full text-center"
						value={states.day}
						onChange={(e) => {
							const val = e.target.value;

							setStates.setLoading(true);
							setStates.setDay(val);
							setStates.setTrackLabels({
								title: "",
								subtitle: "",
								timeRemaining: "",
							});
						}}>
						{days.map((dayKey: string, i) => (
							<option
								key={i}
								value={dayKey}>
								{dayKey}
							</option>
						))}
					</select>
				</div>
				<IconButton
					className="hover:bg-white hover:bg-opacity-15 rounded-full p-2"
					onClick={() => {
						const index = days.findIndex((o) => o == states.day);
						const nextIndex = index + 1 > days.length - 1 ? 0 : index + 1;
						const nextDay = days[nextIndex];

						setStates.setLoading(true);
						setStates.setDay(nextDay);
						setStates.setTrackLabels({
							title: "",
							subtitle: "",
							timeRemaining: "",
						});
					}}>
					<ArrowForwardIosIcon className="*:fill-white" />
				</IconButton>
			</div>
		</div>
	);
}
