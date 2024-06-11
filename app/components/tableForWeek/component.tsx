"use client";

import React, { useEffect, useState } from "react";
import { defaultSettings, getCurrentLsn } from "@/app/lib/trackHelper";
import { weekList } from "@/app/lib/types";

export default function TableForWeek({ oddeven }: { oddeven: "even" | "odd" }) {
	const [settings, setSettings] = useState(defaultSettings);
	const [weekList, setweekList] = useState<weekList>();
	const [fullTable, setFullTable] = useState<React.JSX.Element[]>();

	const [classFullName, setClassFullName] = useState<string>("")
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

		setClassFullName(level + className)
	}, [settings]);

	useEffect(() => {
		const time = { h: 8, m: 0 };
		const weekListInStep: { [key: string]: any } = {};

		const fulltbl: React.JSX.Element[] = [];

		const timeRowChildren = [<th></th>];
		const timeRow = <tr>{timeRowChildren}</tr>;
		for (let i = 0; i < 22; i++) {
			timeRowChildren.push(<th>{`${time.h}:${time.m.toString().padStart(2, "0")}`}</th>);

			for (const day in weekList) {
				if (!Object.prototype.hasOwnProperty.call(weekListInStep, day)) {
					weekListInStep[day] = {};
				}
				const dayList = weekList[day as keyof weekList];

				const h = (time.h < 10 ? "0" + time.h : time.h).toString();
				const m = (time.m < 10 ? "0" + time.m : time.m).toString();
				const t24 = h + m;

				const exactStartName = dayList[t24];
				if (exactStartName) {
					weekListInStep[day][t24] = exactStartName;
					continue;
				}

				const timeList = Object.keys(dayList).toSorted();

				const timeAfter = getCurrentLsn(timeList, parseInt(t24));
				if (timeAfter == null) {
					weekListInStep[day][t24] = "";
					continue;
				}

				const timeI = timeList.indexOf(timeAfter.toString()) - 1;
				const steppedTime = timeList[timeI];
				weekListInStep[day][t24] = dayList[steppedTime];
			}

			time.m += 20;
			if (time.m >= 60) {
				time.h++;
				time.m -= 60;
			}
		}
		fulltbl.push(timeRow);

		for (const day in weekList) {
			if (day == "default") continue;
			const dayRowChildren: React.JSX.Element[] = [];
			const dayRow = <tr>{dayRowChildren}</tr>;
			dayRowChildren.push(<th>{day}</th>);
			fulltbl.push(dayRow);

			// var lastSubj: string | null = null;
			const sortedKeys = Object.keys(weekListInStep[day]).toSorted();

			if (parseInt(sortedKeys[0]) > 800) {
				const td = <td colSpan={2}></td>;
				dayRowChildren.push(td);
			}

			sortedKeys.forEach((cday) => {
				// if (lastSubj && weekListInStep[day][cday] == lastSubj) {
				// 	lastSubj.colSpan++;
				// 	return;
				// }
				var subj = weekListInStep[day][cday];
				if (subj == "{SciElec}") subj = settings.Elec.Sci;

				const td = <td>{subj}</td>;
				dayRowChildren.push(td);
				// lastSubj = subj;
			});
		}

		setFullTable(fulltbl);
	}, [weekList]);
	return (
		<>
			<h1 className="flex justify-center my-5 w-auto">
				{classFullName}: {oddeven.replace(/^./, (str) => str.toUpperCase())} Week
			</h1>
			<table>
				<tbody>{fullTable}</tbody>
			</table>
		</>
	);
}
