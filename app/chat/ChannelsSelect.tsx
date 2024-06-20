"use client";

import { useEffect, useState } from "react";
import { defaultSettings } from "../lib/trackHelper";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fstat } from "fs";

export default function ChannelsSelect() {
	const searchParams = useSearchParams();
	const curChannel = searchParams.get("ctype");

	const [settings, setSettings] = useState(defaultSettings);
	const [smShow, setSmShow] = useState(false);

	useEffect(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) setSettings(JSON.parse(savedSettings));
	}, []);

	useEffect(() => {
		if (curChannel == null) {
			setSmShow(true);
		} else {
			setSmShow(false);
		}
	}, [curChannel]);

	const channels = [
		{ ctype: "public", name: "public" },
		{ ctype: "level", name: "Sec-" + settings.class.level },
		{ ctype: "class", name: settings.class.level + settings.class.class },
	];

	return (
		<ul className={`bg-secondary-color p-3 w-60 sm:block ${smShow ? "block" : "hidden"}`}>
			{channels.map((c) => {
				return (
					<li
						key={c.ctype}
						className={`p-2 m-1 rounded-md hover:bg-menu-color ${
							c.ctype == curChannel ? "bg-menu-color" : ""
						}`}>
						<Link
							className="w-full h-full inline-block"
							href={`/chat/channel?ctype=${c.ctype}`}>
							#{c.name}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
