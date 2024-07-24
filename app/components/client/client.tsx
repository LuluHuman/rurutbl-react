"use client";
// Hold crap this code better without date24
import { CircularProgress, CircularProgressLoading } from "./circularProgress";
import { Track, TrackLoading } from "./track";

import { dayList, ClientType, crowdedness, weekList } from "../../lib/types";
import { getMidnightOffset, getCurrentLsn, defaultSettings, msToHM } from "../../lib/trackHelper";

import { useEffect, useState } from "react";

import "@/app/lib/skeleton.css";

const alp = "xABCDEFGHI".split("");
export default function Client({ isOdd, canteenCrowdness }: ClientType) {
	//!              "Sunday"                                                          "Saturday"
	const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"];
	//!                   "Sun"                                        "Sat"
	const shortDayName = ["Mon", "Mon", "Tues", "Wed", "Thurs", "Fri", "Mon"];

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

		const req = import(`@/public/classes/${level}/${className}/${isOdd ? "odd" : "even"}.json`);
		req.then(setweekListn);
	}, [settings]);

	useEffect(() => {
		const i: NodeJS.Timeout = setInterval(() => {
			if (!weekList) return clearInterval(i);

			// Date stuff
			const curDate = new Date();
			const midnightOffset = getMidnightOffset(curDate);

			const day = dayName[curDate.getDay()] as keyof typeof weekList;
			setDay(day);

			const dayList: dayList = weekList[day] as dayList;
			setDaylist(dayList);

			const sortedTimeList = Object.keys(dayList).toSorted();
			const lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);

			if (midnightOffset > lastLsnTime) {
				clearInterval(i);

				const nextI = curDate.getDay() + 1;
				const nextDay = dayName[nextI] as keyof typeof weekList;
				setDay(nextDay);

				const nextdayList = weekList[nextDay];
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
	}, [settings, weekList]);

	function locSubj(Subject: string | null | string[]) {
		Subject = typeof Subject == "string" || Subject == null ? Subject : Subject[0];
		switch (Subject) {
			case "{SciElec}":
				return settings.Elec.Sci || Subject;

			default:
				return Subject;
		}
	}

	const pth = [
		(isOdd ? "Odd" : "Even") + " Week",
		day,
		`Class ${settings.class.level + alp[settings.class.class]}`,
	];
	return (
		<>
			{!loading ? (
				<>
					<h2 id="classTitle">
						Class {settings.class.level + alp[settings.class.class]}
					</h2>
					<CircularProgress
						valuePercentage={progressPercentage}
						text={trackLabels}
					/>
					<Track
						settings={settings}
						dayList={daylist}
						canteenCrowdness={canteenCrowdness as crowdedness}
						day={day}
						active={activeIndex}
					/>
					<p className=" w-full text-center">Current: {pth.join(" / ")}</p>
				</>
			) : (
				<>
					<h2 id="classTitle">
						I know no one uses this website so <br /> I WANT TO BE A GIRL!!! {">w<"}
					</h2>

					<CircularProgressLoading />
					<TrackLoading />
				</>
			)}
		</>
	);
}
