"use client";
// Hold crap this code is a mess
import { CircularProgress, CircularProgressLoading } from "../circularProgress/component";
import { Track, TrackLoading } from "../track/component";
import { dayList, ClientType, crowdedness, weekList } from "../../lib/types";
import { Date24, getCurrentLsn, defaultSettings } from "../../lib/trackHelper";

import { useEffect, useState } from "react";

import "@/app/lib/skeleton.css";

const alp = "xABCDEFGHI".split("");
export default function Client({ isOdd, canteenCrowdness }: ClientType) {
	//!              "Sunday"                                                          "Saturday"
	const dayName = ["Monday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday"];
	//!                   "Sun"                                       "Sat"
	const shortDayName = ["Mon", "Mon", "Tues", "Wed", "Thurs", "Fri", "Mon"];

	const [loading, setLoading] = useState(true);
	const [trackLabels, setTrackLabels] = useState({ title: "", subtitle: "", timeRemaining: "" });
	const [progressPercentage, setProgressPercentage] = useState(0);
	const [daylist, setDaylist] = useState({});
	const [day, setDay] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);

	const [settings, setSettings] = useState(defaultSettings);
	var [weekList, setweekListn] = useState<weekList>();

	// Do once
	useEffect(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));
	}, []);

	// When 'setting' is set
	useEffect(() => {
		const { level, class: className } = settings.class;

		const req = import(
			`../../../public/classes/${level}/${className}/${isOdd ? "odd" : "even"}.json`
		);
		req.then(setweekListn);
	}, [settings]);

	useEffect(() => {
		const i: NodeJS.Timeout = setInterval(() => {
			if (!weekList) return clearInterval(i);

			// Date stuff
			const curDate = new Date();
			const curTime24 = new Date24();
			const curTime = curTime24.toInt();

			var day = dayName[curDate.getDay()] as keyof typeof weekList;

			const dayList: dayList = weekList[day] as dayList;
			setDaylist(dayList);
			setDay(day);

			const sortedTimeList = Object.keys(dayList).toSorted();
			let lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);

			if (curTime > lastLsnTime) {
				clearInterval(i);

				let _nextI = curDate.getDay() + 1;

				let _nextDay = dayName[_nextI] as keyof typeof weekList;
				const nextday = weekList[_nextDay];


				if (loading) setLoading(false);
				setDaylist(nextday);
				setDay(_nextDay);

				const sortedTimeList = Object.keys(nextday).toSorted();
				const reportTime = sortedTimeList[0];

				setTrackLabels({
					title: `${shortDayName[_nextI] || shortDayName[1]} - ${reportTime}`,
					subtitle: `First lesson is ${nextday[reportTime]}`,
					timeRemaining: "",
				});
				return;
			}

			const curLessont24: Date24 = getCurrentLsn(sortedTimeList, curTime);
			let prevI = sortedTimeList.indexOf(curLessont24.toString()) - 1;
			const curLsn = dayList[sortedTimeList[prevI]];
			const nextLsn = dayList[curLessont24.t24];

			const { hours: curHours, minutes: curMins } = curTime24.toTimeHourObject();
			const { hours: LessonHours, minutes: LessonMins } = curLessont24.toTimeHourObject();

			const curMinsTotal = curHours * 60 + curMins;
			const LessonMinsTotal = LessonHours * 60 + LessonMins;

			const remainingMinutes =
				LessonMinsTotal * 60 - (curMinsTotal * 60 + curDate.getSeconds());
			const prevSub = sortedTimeList[prevI];
			const { hours: prevhours, minutes: prevminutes } = new Date24(prevSub);

			const prevtotalMinutes = parseInt(prevhours) * 60 + parseInt(prevminutes);
			const SubjDuration = LessonMinsTotal * 60 - prevtotalMinutes * 60;

			const remainingPercentage = (SubjDuration - remainingMinutes) / SubjDuration;
			setProgressPercentage(remainingPercentage);

			const totalMinutesLeft = LessonMinsTotal - curMinsTotal;
			const hoursLeft = Math.floor(totalMinutesLeft / 60);
			const minutesLeft = totalMinutesLeft % 60;
			setActiveIndex(sortedTimeList.indexOf(curLessont24.toString()) - 1);

			const _hr = hoursLeft.toString().padStart(2, "0");
			const _min = minutesLeft.toString().padStart(2, "0");
			const _sec = (60 - curDate.getSeconds()).toString().padStart(2, "0");

			const _fallbackTitle = `Time until Start class (${dayList[sortedTimeList[0]]})`;
			setTrackLabels({
				title:
					localisedSubject(
						typeof curLsn == "string" || curLsn == null ? curLsn : curLsn[0]
					) || _fallbackTitle,
				subtitle: curLsn
					? nextLsn
						? `Time until ${localisedSubject(
								typeof nextLsn == "string" || nextLsn == null ? nextLsn : nextLsn[0]
						  )}`
						: "Time Left"
					: "",
				timeRemaining: `${_hr}:${_min.length == 1 ? "0" + _min : _min}:${_sec}`,
			});

			if (loading) setLoading(false);
		}, 500);
	}, [settings, weekList]);

	function localisedSubject(Subject: string | null) {
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
						I know no one uses this website to <br /> I WANT TO BE A GIRL!!! {">w<"}
					</h2>

					<CircularProgressLoading />
					<TrackLoading />
				</>
			)}
		</>
	);
}
