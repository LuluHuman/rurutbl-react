"use client";
import { defaultSettings } from "@/app/lib/trackHelper";
import React, { useEffect, useState } from "react";
export function ClassSelector({ title, props: classes }: { title: string; props: any }) {
	const [levelVal, setLevelVal] = useState("");
	const [classVal, setClassVal] = useState("");
	const [settings, setSettings] = useState(defaultSettings);
	const [newSettings, setNewSettings] = useState({});

	useEffect(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));
		setLevelVal(settings.class.level);
		setClassVal(settings.class.class);
		if (Object.prototype.hasOwnProperty.call(newSettings, "class")) {
			localStorage.setItem("settings", JSON.stringify(newSettings));
			setNewSettings({});
		}
	}, [newSettings, levelVal, classVal]);

	const levels = [<></>];
	for (const level in classes) {
		if (level == "default") continue;
		levels.push(
			<option
				key={level}
				value={level}>
				{level}
			</option>
		);
	}
	const classNames = [<></>];
	classes[settings.class.level].forEach((className: string) => {
		classNames.push(
			<option
				key={className}
				value={className}>
				{className}
			</option>
		);
	});

	return (
		<div className="settingsSegment">
			<h1>{title}</h1>
			<div>
				<span>
					Selected: {levelVal || "_"}
					{classVal || "_"}
				</span>
				<div>
					<div>
						<select
							value={levelVal || ""}
							onChange={(e) => {
								setLevelVal(e.target.value);

								settings.class.level = e.target.value;
								const classExists = Object.prototype.hasOwnProperty.call(
									classes[e.target.value],
									classVal
								);
								if (!classExists) {
									settings.class.class = classes[e.target.value][0];
								}
								setSettings(settings);
								setNewSettings(settings);
							}}>
							{levels}
						</select>
					</div>
					<div>
						<select
							value={classVal || ""}
							key={classVal || ""}
							onChange={(e) => {
								setClassVal(e.target.value);

								settings.class.class = e.target.value;
								setSettings(settings);
								setNewSettings(settings);
							}}>
							{classNames}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ElecSelector({ title, props: type }: { title: string; props: "Sci" }) {
	const [elective, setElective] = useState("");
	const [settings, setSettings] = useState(defaultSettings);
	const [newSettings, setNewSettings] = useState({});

	useEffect(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));
		setElective(settings.Elec[type]);
		
		if (Object.prototype.hasOwnProperty.call(newSettings, "Elec")) {
			localStorage.setItem("settings", JSON.stringify(newSettings));
			setNewSettings({});
		}
	}, [newSettings, elective]);
	
	const SciElecEle = [<></>];
	const SciElec = ["Physics", "Biology"];
	SciElec.forEach((elective) => {
		SciElecEle.push(
			<option
				key={elective}
				value={elective}>
				{elective}
			</option>
		);
	});

	return (
		<div className="settingsSegment">
			<h1>{title}</h1>
			<div>
				<span>Selected: {elective || "_"}</span>
				<div>
					<div>
						<select
							value={elective || ""}
							onChange={(e) => {
								setElective(e.target.value);

								settings.Elec[type] = e.target.value;
								setSettings(settings);
								setNewSettings(settings);
							}}>
							{SciElecEle}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}
