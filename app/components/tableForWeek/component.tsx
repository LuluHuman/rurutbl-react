"use client";

import React, { useEffect, useState } from "react";
import { defaultSettings, getCurrentLsn } from "@/app/lib/trackHelper";
import { weekList } from "@/app/lib/types";
import { Loading } from "../loading/component";

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

		import(`../../../public/classes/${level}/${className}/${oddeven}.json`).then((res) => {
			setweekList(res);
		});

		setClassFullName(level + className);
	}, [settings]);

	useEffect(() => {
		const time = { h: 8, m: 0 };
		const weekListIncremented: { [key: string]: any } = {};

		const fulltbl: React.JSX.Element[] = [];

		/*  */
		const timeRowChildren = [<th key={"-1"}></th>];
		for (let i = 0; i < 22; i++) {
			timeRowChildren.push(
				<th key={i.toString()}>{`${time.h}:${time.m.toString().padStart(2, "0")}`}</th>
			);
			for (const day in weekList) {
				if (!Object.prototype.hasOwnProperty.call(weekListIncremented, day)) {
					weekListIncremented[day] = {};
				}
				const dayList = weekList[day as keyof weekList];

				const h = (time.h < 10 ? "0" + time.h : time.h).toString();
				const m = (time.m < 10 ? "0" + time.m : time.m).toString();
				const t24 = h + m;

				const exactStartName = dayList[t24];
				if (exactStartName) {
					weekListIncremented[day][t24] = exactStartName;
					continue;
				}

				const timeList = Object.keys(dayList).toSorted();

				const timeAfter = getCurrentLsn(timeList, parseInt(t24));
				if (timeAfter == null) {
					weekListIncremented[day][t24] = "";
					continue;
				}

				const timeI = timeList.indexOf(timeAfter.toString()) - 1;
				const steppedTime = timeList[timeI];
				weekListIncremented[day][t24] = dayList[steppedTime];
			}

			time.m += 20;
			if (time.m >= 60) {
				time.h++;
				time.m -= 60;
			}
		}
		fulltbl.push(<tr key={"timeTr"}>{timeRowChildren}</tr>);

		/*  */
		for (const day in weekList) {
			if (day == "default") continue;

			const dayRowChildren: React.JSX.Element[] = [];
			const dayRow = <tr key={day + "Tr"}>{dayRowChildren}</tr>;
			dayRowChildren.push(<th key={day + "Th"}>{day}</th>);
			fulltbl.push(dayRow);

			const sortedTime = Object.keys(weekListIncremented[day]).toSorted();

			for (let i = 0; i < sortedTime.length; i++) {
				const curTime = sortedTime[i];
				var curSubj = weekListIncremented[day][curTime];

				var colspan = 1;

				const prevTime = sortedTime[i - 1];
				const prevSubj = weekListIncremented[day][prevTime];

				if (!(i - 1 < 0) && curSubj == prevSubj) continue;

				const checkAfter = (index: number) => {
					const futreTime = sortedTime[index];
					const futreSubj = weekListIncremented[day][futreTime];
					if (futreSubj == curSubj) {
						colspan++;
						checkAfter(index + 1);
					}
				};
				checkAfter(i + 1);

				const isElecSci = curSubj == "{SciElec}";
				const td = (
					<td colSpan={colspan > 1 ? colspan : undefined}>
						{isElecSci ? settings.Elec.Sci : curSubj}
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
			<h1 className="flex justify-center my-5 w-auto">
				{classFullName}: {oddeven.replace(/^./, (str) => str.toUpperCase())} Week
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

/*
#full-root > table > tbody {
	border-collapse: collapse;
	width: 800px;
}
#full-root > table > tbody > tr:nth-child(odd) {
	background-color:  var(--color-secondary);
}

#full-root > table > tbody > tr > td,
#full-root > table > tbody > tr > th {
	text-align: center;
	padding: 8px;
	border: var(--color-grey) solid 1px;
}

#full-root > table > tbody > td {
	font-size: 0.7em;
	color: #ffffffaa;
}
*/
