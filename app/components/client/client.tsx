"use client";
import { CircularProgress, CircularProgressLoading } from "./circularProgress";
import { Track, TrackLoading } from "./track";
import { Config, PublicConfig } from "./config";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { dayList, ClientType, weekList } from "../../lib/types";
import {
	getMidnightOffset,
	getCurrentLsn,
	defaultSettings,
	msToHM,
	locSubjInit,
	ToDayStr,
	alp,
} from "../../lib/functions";

import React, { useEffect, useState } from "react";

import "@/app/lib/skeleton.css";

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
		const curDate = new Date();
		const midnightOffset = getMidnightOffset(curDate);

		const curDay = ToDayStr(curDate.getDay()).long as keyof typeof weekList;
		const dayList: dayList = weekList[curDay] as dayList;

		const sortedTimeList = Object.keys(dayList).toSorted();
		const lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);
		if (midnightOffset > lastLsnTime) {
			const nextI = curDate.getDay() + 1;
			const nextDay = ToDayStr(nextI).long as keyof typeof weekList;
			const nextdayList = weekList[nextDay];

			setDay(nextDay);
			setDaylist(nextdayList);

			const sortedTimeList = Object.keys(nextdayList).toSorted();
			const startMs = parseInt(sortedTimeList[0]);
			const HM = msToHM(startMs);
			setTrackLabels({
				title: `${ToDayStr(nextI).short || ToDayStr(1).short} - ${HM}`,
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

			const dayList: dayList = weekList[day];
			setDaylist(dayList);

			const sortedTimeList = Object.keys(dayList).toSorted();
			const lastLsnTime = parseInt(sortedTimeList[sortedTimeList.length - 1]);

			if (loading) setLoading(false);
			if (midnightOffset > lastLsnTime) return;

			const locSubj = locSubjInit(settings);
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

			const totalSecLeft = LessonSecTotal - curSecTotal;
			const time = new Date(totalSecLeft * 1000).toISOString().substr(11, 8);

			const _fallbackTitle = `Time until Start class (${dayList[sortedTimeList[0]]})`;
			const nextLessionLabel = "Time " + (nextLsn ? "until" + locSubj(nextLsn) : "Left");

			const remainingPercentage = (SubjDuration - remainingSec) / SubjDuration;
			setProgressPercentage(remainingPercentage);
			setActiveIndex(sortedTimeList.indexOf(nextLsnTime) - 1);
			setTrackLabels({
				title: locSubj(curLsn) || _fallbackTitle,
				subtitle: curLsn ? nextLessionLabel : "",
				timeRemaining: time,
			});
		}, 500);
		setCurrentTimeout(i);
	}, [settings, weekList, day]);

	return (
		<>
			{!loading ? (
				<>
					{simple ? (
						<></>
					) : (
						<PublicConfig
							settings={settings}
							states={{
								weekState: weekState,
								day: day,
							}}
							setStates={{
								setLoading: setLoading,
								setTrackLabels: setTrackLabels,
								setweekState: setweekState,
								setDay: setDay,
							}}
						/>
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
							states={{
								day: day,
								weekState: weekState,
							}}
							setStates={{
								setTrackLabels: setTrackLabels,
								setLoading: setLoading,
								setweekState: setweekState,
								setDay: setDay,
							}}
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
