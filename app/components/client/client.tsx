"use client";
// Hold crap this code better without date24
import { CircularProgress, CircularProgressLoading } from "./circularProgress";
import { Track, TrackLoading } from "./track";

import { dayList, ClientType, crowdedness, weekList } from "../../lib/types";
import { getMidnightOffset, getCurrentLsn, defaultSettings, msToHM } from "../../lib/trackHelper";

import React, { useEffect, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import "@/app/lib/skeleton.css";
import Link from "next/link";

const alp = "xABCDEFGHI".split("");

export default function Client({ isOdd, h2StyleCustom, config }: ClientType) {
	const h2Style = h2StyleCustom || "mt-10 w-screen flex justify-center";
	//!              "Sunday"                                                          "Saturday"
	const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"];
	//!                   "Sun"                                        "Sat"
	const shortDayName = ["Mon", "Mon", "Tues", "Wed", "Thurs", "Fri", "Mon"];
	const weekState = isOdd ? "odd" : "even";

	const [loading, setLoading] = useState(true);
	const [trackLabels, setTrackLabels] = useState({ title: "", subtitle: "", timeRemaining: "" });
	const [progressPercentage, setProgressPercentage] = useState(0);
	const [weekList, setweekListn] = useState<weekList>();
	const [daylist, setDaylist] = useState({});
	const [day, setDay] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const [settings, setSettings] = useState(defaultSettings);

	useEffect(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));
	}, []);

	useEffect(() => {
		const { level, class: className } = settings.class;
		const req = import(`@/public/classes/${level}/${className}/${weekState}.json`);
		req.then(setweekListn);
	}, [settings]);

	useEffect(() => {
		if (!weekList) return;
		const curDate = new Date();
		const midnightOffset = getMidnightOffset(curDate);
		const curDay = dayName[curDate.getDay()] as keyof typeof weekList;

		const dayList: dayList = weekList[curDay] as dayList;
		const sortedTimeList = Object.keys(dayList).toSorted();
		const lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);
		if (midnightOffset > lastLsnTime) {
			const nextI = curDate.getDay() + 1;
			const nextDay = dayName[nextI] as keyof typeof weekList;
			const nextdayList = weekList[nextDay];

			setDay(nextDay);
			setDaylist(nextdayList);

			const sortedTimeList = Object.keys(nextdayList).toSorted();
			const startMs = parseInt(sortedTimeList[0]);
			const HM = msToHM(startMs);
			setTrackLabels({
				title: `${shortDayName[nextI] || shortDayName[1]} - ${HM}`,
				subtitle: `First lesson is ${nextdayList[sortedTimeList[0]]}`,
				timeRemaining: "",
			});

			if (loading) setLoading(false);
			return;
		}
		setDay(curDay);
	}, [settings, weekList]);

	const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
	useEffect(() => {
		if (currentTimeout) clearInterval(currentTimeout);
		if (!weekList) return;
		if (!day) return;
		const i: NodeJS.Timeout = setInterval(() => {
			const curDate = new Date();
			const midnightOffset = getMidnightOffset(curDate);

			const dayList: dayList = weekList[day as keyof weekList] as dayList;
			setDaylist(dayList);

			const sortedTimeList = Object.keys(dayList).toSorted();
			const lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);

			if (midnightOffset > lastLsnTime) return;

			const nextLsnTime: string = getCurrentLsn(sortedTimeList, midnightOffset);

			const prevI = sortedTimeList.indexOf(nextLsnTime) - 1;
			const curLsn = dayList[sortedTimeList[prevI]];
			const nextLsn = dayList[nextLsnTime];

			const curSecTotal = midnightOffset / 1000;
			const LessonSecTotal = parseInt(nextLsnTime) / 1000;
			const remainingSec = LessonSecTotal - curSecTotal;

			const prevSubTime = sortedTimeList[prevI];
			const prevtotalSec = parseInt(prevSubTime) / 1000;
			const SubjDuration = LessonSecTotal - prevtotalSec;

			const remainingPercentage = (SubjDuration - remainingSec) / SubjDuration;
			setProgressPercentage(remainingPercentage);
			setActiveIndex(sortedTimeList.indexOf(nextLsnTime) - 1);

			const totalSecLeft = LessonSecTotal - curSecTotal;
			const time = new Date(totalSecLeft * 1000).toISOString().substr(11, 8);

			const _fallbackTitle = `Time until Start class (${dayList[sortedTimeList[0]]})`;
			const nextLessionLabel = "Time " + (nextLsn ? `until ${locSubj(nextLsn)}` : "Left");

			setTrackLabels({
				title: locSubj(curLsn) || _fallbackTitle,
				subtitle: curLsn ? nextLessionLabel : "",
				timeRemaining: time,
			});

			if (loading) setLoading(false);
		}, 500);
		setCurrentTimeout(i);
	}, [settings, weekList, day]);

	function locSubj(Subject: string | null | string[]) {
		Subject = typeof Subject == "string" || Subject == null ? Subject : Subject[0];
		switch (Subject) {
			case "{SciElec}":
				return settings.Elec.Sci || Subject;
			default:
				return Subject;
		}
	}

	const wlurl = `/classes/${settings.class.level}/${settings.class.class}/${weekState}.json`;
	var pth: { [key: string]: string | number | React.JSX.Element } = {};
	if (config)
		pth = {
			Week: `${config.weekNumber} (${weekState})`,
			"Stated Day": <SetDay />,
			"Actual Day": `${
				dayName[config.countToDate.getDay()]
			} (i: ${config.countToDate.getDay()})`,
			"Class Level": settings.class.level,
			"Class Alphabat": `${alp[settings.class.class]} (${settings.class.class})`,
			"Date From": `${config.countFromDate.toDateString()} (Semester Start)`,
			"Date To": `${config.countToDate.toDateString()} (Current Date)`,
			"Week List File": (
				<Link
					className="underline"
					href={wlurl}>
					@/public{wlurl}
				</Link>
			),
		};

	function SetDay() {
		const onClick = () => {
			const day = window.prompt("Set Day:");
			if (!day) return;
			if (!dayName.includes(day)) return;
			setTrackLabels({
				title: `Day Override`,
				subtitle: day,
				timeRemaining: "",
			});
			setDay(day);
		};
		return (
			<>
				<span>{day} </span>
				<button
					onClick={onClick}
					className="underline">
					(Change)
				</button>
			</>
		);
	}

	return (
		<>
			{!loading ? (
				<>
					<h2 className={h2Style}>
						Class {settings.class.level + alp[settings.class.class]}
					</h2>
					<CircularProgress
						valuePercentage={progressPercentage}
						text={trackLabels}
					/>
					<Track
						settings={settings}
						dayList={daylist}
						day={day}
						active={activeIndex}
						isOdd={isOdd}
					/>
					{config ? (
						<div className="w-full flex justify-center">
							<Accordion className="w-96 bg-secondary-color text-white">
								<AccordionSummary>
									<span>Developer Tools (For sigmas only)</span>
								</AccordionSummary>
								<AccordionDetails>
									<p>
										{Object.keys(pth).map((pthKey: string) => (
											<div>
												{pthKey}:{" "}
												<span className="text-orange-600">
													{pth[pthKey]}
												</span>
											</div>
										))}
									</p>
								</AccordionDetails>
							</Accordion>
						</div>
					) : (
						""
					)}
				</>
			) : (
				<>
					<h2 className={h2Style}>I WANT TO BE A GIRL!!! {">w<"}</h2>

					<CircularProgressLoading />
					<TrackLoading />
				</>
			)}
		</>
	);
}
