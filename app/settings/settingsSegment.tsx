"use client";
import { defaultSettings } from "@/app/lib/functions";
import React, { useEffect, useState } from "react";
export function ClassSelector({ title }: { title: string }) {
	const alp = "xABCDEFGHI".split("");

	const [classes, setClasses] = useState<any>();
	const [classObject, setClassObj] = useState<typeof defaultSettings.class>();

	const [settings, setSettings] = useState(defaultSettings);
	const [newSettings, setNewSettings] = useState({});

	const [classNames, setclassNames] = useState<React.JSX.Element[]>();
	const [levels, setlevels] = useState<React.JSX.Element[]>();

	useEffect(() => {
		fetch("/api/getClasses")
			.then((d) => d.json())
			.then(setClasses);
	}, []);

	useEffect(() => {
		if (!classes) return;

		function Option({ label, isNumeric = false }: { label: string; isNumeric?: boolean }) {
			return (
				<option
					key={label}
					value={label}
					className="text-black">
					{isNumeric ? label : alp[parseInt(label)]}
				</option>
			);
		}

		const LevelOptions = Object.keys(classes);
		const levels: React.JSX.Element[] = LevelOptions.map((level) => (
			<Option
				label={level}
				isNumeric
			/>
		));
		setlevels(levels);

		const ClassOptions = classes[settings.class.level];
		const classNames: React.JSX.Element[] = ClassOptions.map((className: string) => (
			<Option label={className} />
		));
		setclassNames(classNames);
	}, [settings, classes]);

	useEffect(() => {
		if (Object.prototype.hasOwnProperty.call(newSettings, "class")) {
			localStorage.setItem("settings", JSON.stringify(newSettings));
			setNewSettings({});
			return;
		}
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));
		setClassObj(settings.class);
	}, [newSettings]);

	return (
		<SettingContainer
			title={title}
			selectedText={
				(classObject ? classObject.level : "3?") +
				(classObject ? alp[classObject.class] : "B?")
			}>
			<Select
				defaultOption={classObject ? classObject.level : ""}
				key="1"
				onChange={(e) => {
					settings.class.level = parseInt(e.target.value);

					const level = classes[e.target.value];
					const valueInObject = Object.prototype.hasOwnProperty;
					const classExists = valueInObject.call(
						level,
						classObject ? classObject.class : -1
					);
					if (!classExists) settings.class.class = classes[e.target.value][0];

					setClassObj(settings.class);
					setSettings(settings);
					setNewSettings(settings);
				}}>
				{levels}
			</Select>
			<Select
				defaultOption={classObject ? classObject.class : ""}
				key="2"
				onChange={(e) => {
					const val = parseInt(e.target.value);
					settings.class.class = val;

					setClassObj(settings.class);
					setSettings(settings);
					setNewSettings(settings);
				}}>
				{classNames}
			</Select>
		</SettingContainer>
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
				value={elective}
				className="text-black">
				{elective}
			</option>
		);
	});

	return (
		<SettingContainer
			title={title}
			selectedText={elective || "Phy/Bio?"}>
			<Select
				defaultOption={elective || ""}
				onChange={(e) => {
					setElective(e.target.value);

					settings.Elec[type] = e.target.value;
					setSettings(settings);
					setNewSettings(settings);
				}}>
				{SciElecEle}
			</Select>
		</SettingContainer>
	);
}

function SettingContainer({
	children,
	title,
	selectedText,
}: {
	children: React.ReactNode;
	title: string;
	selectedText: string;
}) {
	return (
		<div className="settingsSegment m-5 w-full flex flex-col items-center">
			<h1 className="w-full text-3xl">{title}</h1>
			<div>
				<span>Selected: {selectedText}</span>
				<div className="flex justify-center">{children}</div>
			</div>
		</div>
	);
}
function Select({
	children: options,
	onChange,
	defaultOption,
}: {
	children: React.ReactNode;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	defaultOption: string | number;
}) {
	return (
		<div>
			<select
				value={defaultOption || ""}
				onChange={onChange}
				className="text-black m-[2px]">
				{options}
			</select>
		</div>
	);
}
