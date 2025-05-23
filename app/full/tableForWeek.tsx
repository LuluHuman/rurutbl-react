"use client";

import React, { useEffect, useState } from "react";
import { defaultSettings, getNextLsn, DateMs } from "@/app/lib/functions";
import { weekList } from "@/app/lib/types";
import { Loading } from "../components/Loading";

const alp = "ABCDEFGHI".split("");
const cellClass = "text-center p-2 border border-grey";
const trClass = cellClass + " text-[0.7em] text-[#ffffffaa]";

export default function TableForWeek({ oddeven }: { oddeven: "even" | "odd" }) {
	const [settings, setSettings] = useState(defaultSettings);
	const [weekList, setweekList] = useState<weekList>();
	const [fullTable, setFullTable] = useState<React.JSX.Element[]>();
	const [loading, setLoading] = useState(true);
	const [classFullName, setClassFullName] = useState<string>("");
	// Do once

	useEffect(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));
	}, []);

	// When 'setting' is set
	useEffect(() => {
		const { level, class: className } = settings.class;
		setClassFullName(level + alp[className]);

		try {
			const filePromise = import(`@/public/classes/${level}/${className}/${oddeven}.json`);
			filePromise.then(setweekList);
		} catch (err) {
			console.log(err);
		}
	}, [settings]);

	useEffect(() => {
		var timeMs = 8 * 60 * 60 * 1000;
		const weekListIncremented: { [key: string]: any } = {};

		const fulltbl: React.JSX.Element[] = [];

		/*  */
		const timeRowChildren = [
			<th
				key={"-1"}
				className={trClass}>
				<div>from:</div>
				<div>to:</div>
			</th>,
		];
		for (let i = 0; i < 22; i++) {
			var timeAfterMs = timeMs + 20 * 60 * 1000;
			const from = new DateMs().toHourMinuteString(timeMs);
			const to = new DateMs().toHourMinuteString(timeAfterMs);
			timeRowChildren.push(
				<th
					key={i.toString()}
					className={trClass}>
					{[from, to].map((time) => (
						<div className="whitespace-nowrap">{time}</div>
					))}
				</th>
			);

			for (const day in weekList) {
				const dayExists = Object.prototype.hasOwnProperty.call(weekListIncremented, day);
				if (!dayExists) weekListIncremented[day] = {};

				const dayList = weekList[day as keyof weekList];
				const timeList = Object.keys(dayList).toSorted();

				const timeAfter = getNextLsn(timeList, timeMs);
				if (timeAfter !== null) {
					const timeI = timeList.indexOf(timeAfter.toString()) - 1;
					const steppedTime = timeList[timeI];
					weekListIncremented[day][timeMs] = dayList[steppedTime];
					continue;
				}

				weekListIncremented[day][timeMs] = "";
			}

			timeMs = timeAfterMs;
		}
		fulltbl.push(
			<tr
				key={"timeTr"}
				className={cellClass}>
				{timeRowChildren}
			</tr>
		);

		/*  */
		for (const day in weekList) {
			if (day == "default") continue;

			const dayRowChildren: React.JSX.Element[] = [];
			const dayRow = <tr key={day + "Tr"}>{dayRowChildren}</tr>;
			dayRowChildren.push(
				<th
					key={day + "Th"}
					className={trClass}>
					{day}
				</th>
			);
			fulltbl.push(dayRow);

			const sortedTime = Object.keys(weekListIncremented[day]).toSorted();

			for (let i = 0; i < sortedTime.length; i++) {
				var colspan = 1;

				const curTime = sortedTime[i];
				const curSubj = weekListIncremented[day][curTime];

				const prevTime = sortedTime[i - 1];
				const prevSubj = weekListIncremented[day][prevTime];

				if (!(i - 1 < 0) && curSubj == prevSubj) continue;

				const checkAfter = (index: number) => {
					const futreTime = sortedTime[index];
					const futreSubj = weekListIncremented[day][futreTime];
					if (futreSubj !== curSubj) return;

					colspan++;
					checkAfter(index + 1);
				};
				checkAfter(i + 1);

				const isElecSci = curSubj == "{SciElec}";
				const isMany = typeof curSubj == "object" && curSubj !== null;
				const td = (
					<td
						colSpan={colspan > 1 ? colspan : undefined}
						className={cellClass}>
						{isElecSci ? settings.Elec.Sci : isMany ? curSubj.join(" / ") : curSubj}
					</td>
				);
				dayRowChildren.push(td);
			}
		}

		setFullTable(fulltbl);
		setLoading(false);
	}, [weekList]);

	return (
		<>
			<h1 className="flex justify-center my-5 w-auto text-3xl">
				{classFullName || "XX"}: {oddeven.replace(/^./, (str) => str.toUpperCase())} Week
			</h1>
			{loading ? (
				<Loading />
			) : (
				<table>
					<tbody className="[&>*:nth-child(odd)]:bg-secondary-color">{fullTable}</tbody>
				</table>
			)}
		</>
	);
}
