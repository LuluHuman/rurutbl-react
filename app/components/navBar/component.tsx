"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function NavBar() {
	const pathname = usePathname();

	const [collapsed, setCollapsed] = useState(true);
	const buttons = {
		__Menu: ["", "\ue5d2"],
		"/": ["Main", "\ue88a"],
		"/full": ["Full Table", "\ueb85"],
		"/bus-arrival": ["Bus Arrival", "\ue530"],
		__Seperator: [],
		"/settings": ["Settings", "\ue8b8"],
	};

	const links = [];
	for (const path in buttons) {
		const [label, icon] = buttons[path as keyof typeof buttons];

		const isSeperator = path == "__Seperator";
		const isMenu = path == "__Menu";
		const isActive = path == pathname;

		if (isMenu) {
			links.push(
				<li
					className={`p-2 rounded mb-5 sm:list-item hidden `}
					key={path}>
					<button
						onClick={() => setCollapsed(!collapsed)}
						className="flex">
						<span className="icon material-icons">{icon}</span>
						<span className={`label ${collapsed ? "hidden" : ""}`}>{label}</span>
					</button>
				</li>
			);
			continue;
		}
		if (isSeperator) {
			links.push(
				<li
					className={"border-t-gray-600 border-t-2 p-0"}
					key={path}
				/>
			);
			continue;
		}
		links.push(
			<li
				className={isActive ? "active" : ""}
				key={path}>
				<Link
					href={path}
					className="flex">
					<span
						className="icon material-icons"
						dangerouslySetInnerHTML={{ __html: icon }}
					/>
					<span className={`label ${collapsed ? "sm:hidden " : ""}`}>{label}</span>
				</Link>
			</li>
		);
	}
	return <ul className="fixed z-10	">{links}</ul>;
}
