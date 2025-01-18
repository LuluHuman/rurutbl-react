"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import SettingsIcon from "@mui/icons-material/Settings";


const liClass = " whitespace-nowrap m-1 p-2 rounded transition duration-500 hover:bg-menu-hover";
export function NavBar() {
	const pathname = usePathname();

	if (pathname == "/watch") return <></>;
	const [collapsed, setCollapsed] = useState(true);
	const buttons = {
		__Menu: ["", <MenuIcon />],
		"/": ["Home", <HomeIcon />],
		"/full": ["Full Table", <ViewTimelineIcon />],
		__Seperator: [],
		"/settings": ["Settings", <SettingsIcon />],
	};

	const links = [];
	for (const path in buttons) {
		const [label, icon] = buttons[path as keyof typeof buttons];

		const isSeperator = path == "__Seperator";
		const isMenu = path == "__Menu";
		const isActive = path.split("/")[1] == pathname.split("/")[1];

		if (isMenu) {
			links.push(
				<li
					className={`p-2 rounded mb-5 sm:list-item hidden ${liClass}`}
					key={path}>
					<button
						onClick={() => setCollapsed(!collapsed)}
						className="flex">
						<span className="icon">{icon}</span>
						<span className={`label ${collapsed ? "hidden" : ""}`}>{label}</span>
					</button>
				</li>
			);
			continue;
		}
		if (isSeperator) {
			links.push(
				<li
					className={"border-t-gray-600 border-t-2 p-0 "}
					key={path}
				/>
			);
			continue;
		}

		const activeClasses =
			"bg-menu-hover sm:bg-inherit border-l-0 sm:border-l-4 border-b-4 sm:border-b-0";
		links.push(
			<li
				className={(isActive ? activeClasses : "") + liClass}
				key={path}>
				<Link
					href={path}
					className="flex flex-col sm:flex-row text-center">
					<span className="mx-[2px]">{icon}</span>
					<span className={`text-[10px] sm:text-base ${collapsed ? "sm:hidden " : ""}`}>
						{label}
					</span>
				</Link>
			</li>
		);
	}
	return (
		<ul className="fixed z-10 bg-menu-color flex items-center justify-center sm:block sm:h-screen w-screen sm:w-fit bottom-0 sm:bottom-auto p-2 sm:p-0">
			{links}
		</ul>
	);
}
