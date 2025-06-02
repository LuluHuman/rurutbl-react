"use client";
import { CircularProgress, CircularProgressLoading } from "./circularProgress";
import { Track, TrackLoading } from "./track";
import { Config, PublicConfig } from "./config";

import { dayList, weekList } from "../../lib/types";
import { DateMs, getNextLsn, defaultSettings, locSubjInit, ToDayStr } from "../../lib/functions";

import React, { useEffect, useState } from "react";

import "@/app/lib/skeleton.css";
import WeatherData from "./weather";

export default function Client({ simple = false }: { simple?: boolean }) {
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
		fetch("/api/current")
			.then((d) => d.json())
			.then((data) => {
				const current = data as {
					isOdd: boolean;
					weekNumber: number;
					countFromDate: number;
					countToDate: number;
				};

				setweekState(current.isOdd ? "odd" : "even");
			});

		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));
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
		setCurrentTimeout(setInterval(Loop, 1000));
		function Loop() {
			if (!weekList || !day) return;
			const curTime = new DateMs().getMidnightOffset();
			const dayList: dayList = weekList[day];
			setDaylist(dayList);

			const sortedTimeList = Object.keys(dayList).toSorted();
			const lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);

			if (loading) setLoading(false);
			if (curTime > lastLsnTime) return;

			const subEnd_String: string = getNextLsn(sortedTimeList, curTime);
			const subEnd_Int = parseInt(subEnd_String);

			const subI = sortedTimeList.indexOf(subEnd_String) - 1;
			setActiveIndex(subI);

			const subStart_String = subI < 0 ? "0" : sortedTimeList[subI];
			const subStart_Int = subI < 0 ? 0 : parseInt(subStart_String);

			const subRem = subEnd_Int - curTime;
			const subDur = subEnd_Int - subStart_Int;
			const percentage = (subDur - subRem) / subDur;
			setProgressPercentage(percentage);

			const nextLsn = dayList[subEnd_String];
			const curLsn = dayList[subStart_String];

			const _fallbackTitle = `First Subject: ${dayList[sortedTimeList[0]]}`;
			const nextLessionLabel = "Time " + (nextLsn ? "until " + locSubj(nextLsn) : "Left");
			const timeString = new DateMs(subRem).toISOString().substring(11, 19);
			setTrackLabels({
				title: locSubj(curLsn) || _fallbackTitle,
				subtitle: curLsn ? nextLessionLabel : "",
				timeRemaining: timeString,
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
					<CircularProgress
						valuePercentage={progressPercentage}
						text={trackLabels}
					/>
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
					<Track
						settings={settings}
						dayList={daylist}
						day={day}
						active={activeIndex}
						isOdd={weekState == "odd"}
					/>
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
