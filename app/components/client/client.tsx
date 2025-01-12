"use client";
import { CircularProgress, CircularProgressLoading } from "./circularProgress";
import { Track, TrackLoading } from "./track";
import { Config, PublicConfig } from "./config";

import { dayList, ClientType, weekList } from "../../lib/types";
import { DateMs, getCurrentLsn, defaultSettings, locSubjInit, ToDayStr } from "../../lib/functions";

import React, { useEffect, useState } from "react";

import "@/app/lib/skeleton.css";
import WeatherData from "./weather";

export default function Client({ isOdd, simple = false, config }: ClientType) {
	const [settings, setSettings] = useState(defaultSettings);

	const [loading, setLoading] = useState(true);
	const [trackLabels, setTrackLabels] = useState({ title: "", subtitle: "", timeRemaining: "" });
	const [progressPercentage, setProgressPercentage] = useState(0);
	const [activeIndex, setActiveIndex] = useState(0);

	const [weekState, setweekState] = useState<"odd" | "even">("odd");
	const [weekList, setweekListn] = useState<weekList>();
	const [day, setDay] = useState<keyof weekList>();
	const [daylist, setDaylist] = useState({});

	useEffect(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));

		setweekState(isOdd ? "odd" : "even");
	}, []);

	useEffect(() => {
		const { level, class: className } = settings.class;
		const req = import(`@/public/classes/${level}/${className}/${weekState}.json`);
		req.then(setweekListn);
	}, [weekState, settings]);

	useEffect(() => {
		if (!weekList) return;
		const curDate = new DateMs();

		const curDayI = curDate.getDay();
		const curDay = ToDayStr(curDayI).long;
		const dayList: dayList = weekList[curDay] as dayList;

		const sortedTimeList = Object.keys(dayList).toSorted();
		const lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);
		if (curDate.getMidnightOffset() > lastLsnTime) {
			const nextDayI = curDayI + 1 > 6 ? 0 : curDayI + 1;
			const nextDay = ToDayStr(nextDayI).long;
			const nextdayList = weekList[nextDay];
			const nextSortedTimeList = Object.keys(nextdayList).toSorted();

			const firstLsnTime = parseInt(nextSortedTimeList[0]);
			const HM = new DateMs().toHourMinuteString(firstLsnTime);
			setTrackLabels({
				title: `${ToDayStr(nextDayI).short || ToDayStr(1).short} - ${HM}`,
				subtitle: `First lesson is ${nextdayList[nextSortedTimeList[0]]}`,
				timeRemaining: "",
			});

			setDay(nextDay);
			if (loading) setLoading(false);
			return;
		}
		setDay(curDay);
	}, [settings, weekList]);

	const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
	useEffect(() => {
		const locSubj = locSubjInit(settings);

		if (currentTimeout) clearInterval(currentTimeout);
		Loop();
		setCurrentTimeout(setInterval(Loop, 500));
		function Loop() {
			if (!weekList) return;
			if (!day) return;
			const msSinceMidnight = new DateMs().getMidnightOffset();
			const dayList: dayList = weekList[day];
			setDaylist(dayList);

			const sortedTimeList = Object.keys(dayList).toSorted();
			const lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);

			if (loading) setLoading(false);
			if (msSinceMidnight > lastLsnTime) return;

			const nextLsnTime: string = getCurrentLsn(sortedTimeList, msSinceMidnight);

			const prevI = sortedTimeList.indexOf(nextLsnTime) - 1;
			const curLsn = dayList[sortedTimeList[prevI]];
			const nextLsn = dayList[nextLsnTime];

			const curSecTotal = msSinceMidnight / 1000;
			const LessonSecTotal = parseInt(nextLsnTime) / 1000;
			const remainingSec = LessonSecTotal - curSecTotal;

			const prevSubTime = sortedTimeList[prevI];
			const prevtotalSec = parseInt(prevSubTime) / 1000;
			const SubjDuration = LessonSecTotal - prevtotalSec;

			const totalSecLeft = LessonSecTotal - curSecTotal;
			const time = new DateMs(totalSecLeft * 1000).toISOString().substr(11, 8);

			const _fallbackTitle = `Time until Start class (${dayList[sortedTimeList[0]]})`;
			const nextLessionLabel = "Time " + (nextLsn ? "until " + locSubj(nextLsn) : "Left");

			const remainingPercentage = (SubjDuration - remainingSec) / SubjDuration;
			setProgressPercentage(remainingPercentage);
			setActiveIndex(sortedTimeList.indexOf(nextLsnTime) - 1);

			setTrackLabels({
				title: locSubj(curLsn) || _fallbackTitle,
				subtitle: curLsn ? nextLessionLabel : "",
				timeRemaining: time,
			});
		}
	}, [settings, weekList, day]);

	const states = {
		weekState: weekState,
		day: day,
	};
	const setStates = {
		setTrackLabels: setTrackLabels,
		setLoading: setLoading,
		setweekState: setweekState,
		setDay: setDay,
	};
	return (
		<>
			{!loading ? (
				<>
					{simple ? (
						<></>
					) : (
						<div className="w-full flex justify-center">
							<div className="max-w-[600px] w-screen">
								<PublicConfig
									settings={settings}
									states={states}
									setStates={setStates}
								/>
								<WeatherData
									dayList={daylist}
									day={day}
								/>
							</div>
						</div>
					)}
					<CircularProgress
						valuePercentage={progressPercentage}
						text={trackLabels}
					/>
					<Track
						settings={settings}
						dayList={daylist}
						day={day}
						active={activeIndex}
						isOdd={weekState == "odd"}
					/>

					{simple ? (
						<></>
					) : (
						<Config
							config={config}
							settings={settings}
							states={states}
							setStates={setStates}
						/>
					)}
				</>
			) : (
				<>
					<CircularProgressLoading />
					<TrackLoading />
				</>
			)}
		</>
	);
}
