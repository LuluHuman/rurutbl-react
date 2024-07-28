"use client";
import { defaultSettings } from "@/app/lib/trackHelper";
import React, { useEffect, useState } from "react";
export function ClassSelector({ title }: { title: string }) {
	const alp = "xABCDEFGHI".split("");
	const [levelVal, setLevelVal] = useState<number>();
	const [classVal, setClassVal] = useState<number>();
	const [settings, setSettings] = useState(defaultSettings);
	const [newSettings, setNewSettings] = useState({});
	
	const [classes, setClasses] = useState<any>();
	const [classNames, setclassNames] = useState<React.JSX.Element[]>();
	const [levels, setlevels] = useState<React.JSX.Element[]>();
	useEffect(() => {
		fetch("/api/getClasses")
			.then((d) => d.json())
			.then((classes) => {
				const classNamesa = [<></>];
				const levelsa = [<></>];

				classes[settings.class.level].forEach((className: string) => {
					classNamesa.push(
						<option
							key={className}
							value={className}>
							{alp[parseInt(className)]}
						</option>
					);
				});

				for (const level in classes) {
					if (level == "default") continue;
					levelsa.push(
						<option
							key={level}
							value={level}>
							{level}
						</option>
					);
				}
				setClasses(classes);
				setclassNames(classNamesa);
				setlevels(levelsa);
			});
	}, []);

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

	return (
		<div className="settingsSegment">
			<h1>{title}</h1>
			<div>
				<span>
					Selected: {levelVal || "_"}
					{classVal ? alp[classVal] : "_"}
				</span>
				<div>
					<div>
						<select
							value={levelVal || ""}
							key={levelVal || "idk"}
							onChange={(e) => {
								setLevelVal(parseInt(e.target.value));
								settings.class.level = parseInt(e.target.value);

								const valueInObject = Object.prototype.hasOwnProperty;
								const level = classes[e.target.value];
								const classExists = valueInObject.call(level, classVal || -1);
								if (!classExists) settings.class.class = classes[e.target.value][0];

								setSettings(settings);
								setNewSettings(settings);
							}}>
							{levels}
						</select>
					</div>
					<div>
						<select
							value={classVal || ""}
							key={classVal || "idk"}
							onChange={(e) => {
								const val = parseInt(e.target.value);
								setClassVal(val);
								settings.class.class = val;

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
							key={elective || "idk"}
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
